import connectDb from "@/lib/db"
import ChatMessage from "@/models/chatMessage.model";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server"

const geminiUrl = process.env.GEMINI_API_URL!

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const { lastMessage, role } = await req.json()

        const prompt = `You are an AI reply suggestion system for a vehicle booking chat app. 
        
        Generate short, smart, human-like reply suggestions based on: 
        - Role (DRIVER or USER)
        - RECENT_MESSAGE 

        Rules:
        - CRITICAL LANGUAGE RULE: Always match the language, tone, and script of RECENT_MESSAGE:
          * If RECENT_MESSAGE is in Hinglish (Roman Hindi like "kab tak aa rahe ho"), all suggestions MUST be in Hinglish (e.g., "5 minute me pahunch raha hu", "Bas raste me hu", "Thoda traffic hai, 5 min lagenge").
          * If RECENT_MESSAGE is in Hindi (Devanagari script), suggestions MUST be in Hindi.
          * If RECENT_MESSAGE is in English, suggestions MUST be in English.
        - Return exactly 3 suggestions
        - Keep replies short (3-10 words)
        - Match the conversation context and tone 
        - Driver replies should sound professional, polite and helpful 
        - User replies should sound natural and realistic
        - Avoid repetition 
        - Return ONLY valid JSON  

        Output format: 
        { 
            "suggestions" : [ 
                "suggestion 1", 
                "suggestion 2",
                "suggestion 3"
            ]    
        } 

        Input:
        ROLE: ${role}
        RECENT_MESSAGE: ${lastMessage}
        `
        const response = await axios.post(geminiUrl, {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json"
            }
        })

        const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text

        const parsedData = rawText ? JSON.parse(rawText) : { suggestions: [] }

        return NextResponse.json(
            parsedData,
            { status: 200 }
        )

    } catch (error: any) {
        return NextResponse.json(
            { message: `get ai suggestions error ${error.response?.data?.error?.message || error.message}` },
            { status: 500 }
        )

    }
}