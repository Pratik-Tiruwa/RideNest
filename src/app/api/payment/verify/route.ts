import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import Booking from "@/models/booking.model";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { bookingId, razorpay_payment_id, razorpay_signature, razorpay_order_id } = await req.json();

        // generate signatrue on the server
        const generateSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        // comapare generated signature with Razorpay signature 
        if (generateSignature !== razorpay_signature) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Payment verification failed"
                },
                { status: 400 }
            )
        }

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return NextResponse.json(
                { message: "booking not found" }
            )
        }

        const adminCommission = booking.fare * 0.10
        const partnerAmount = booking.fare - adminCommission

        booking.adminCommission = adminCommission
        booking.partnerAmount = partnerAmount

        booking.paymentStatus = "paid"
        booking.bookingStatus = "confirmed"

        await booking.save()

        return NextResponse.json(
            { success: true, adminCommission, partnerAmount }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: `verify payment error ${error}` },
            { status: 500 }
        )
    }
}