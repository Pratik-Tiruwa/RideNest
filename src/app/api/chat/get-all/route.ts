import connectDb from "@/lib/db"
import ChatMessage from "@/models/chatMessage.model";
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        await connectDb(); 


        const bookingId = req.nextUrl.searchParams.get("bookingId"); 

        if(!bookingId) { 
            return NextResponse.json(
                {message : "bookingId is required"}, 
                {status : 400}
            )
        }

        const msgs = await ChatMessage.find({
            bookingId
        }).sort({ createdAt: -1 })

        return NextResponse.json(
            msgs,
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: `get all messages error ${error}` },
            { status: 500 }
        )

    }
}