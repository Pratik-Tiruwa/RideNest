import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { 
    try {
        await connectDb(); 
        const session = await auth(); 
        if (!session || !session.user?.email) { 
            return NextResponse.json(
                { message: "unauthorized" }, 
                { status: 401 }
            );
        }

        const { bookingId } = await req.json();

        if (!bookingId) {
            return NextResponse.json(
                { message: "Booking ID is required" }, 
                { status: 400 }
            );
        }

        const booking = await Booking.findById(bookingId).populate("user vehicle driver");

        if (!booking) {
            return NextResponse.json(
                { message: "Booking not found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            booking,
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `active ride for user error ${error}` }, 
            { status: 500 }
        );
    }
}
