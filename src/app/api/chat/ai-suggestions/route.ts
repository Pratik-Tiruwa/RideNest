import connectDb from "@/lib/db"
import ChatMessage from "@/models/chatMessage.model";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server"

const geminiUrl = process.env.GEMINI_API_URL!

export async function GET(req: NextRequest) {
    try {
        await connectDb();

        const response = await axios.post(geminiUrl, {
            "contents": [
                {
                    "parts": [
                        {
                            "text": "Explain how AI works in few words"
                        }
                    ]
                }
            ]
        })
        console.log(response.data.candidates[0].content.parts[0].text)
        return NextResponse.json(
            { message: 'good' },
            { status: 200 }
        )

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: `get all messages error ${error}` },
            { status: 500 }
        )

    }
}