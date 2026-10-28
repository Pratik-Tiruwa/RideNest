import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth();
        if (!session || !session.user?.role || session.user?.role !== "admin") {
            return Response.json(
                { message: "unauthorized" },
                { status: 400 }
            )
        }

        const { roomId, action, reason } = await req.json()
        if (!roomId) {
            return Response.json(
                { message: "roomId is required" },
                { status: 400 }
            )
        }

        if (!["approved", "reject"].includes(action)) {
            return Response.json(
                { message: "Invalid action" },
                { status: 400 }
            )
        }

        const partner = await User.findOne({
            videoKycRoomId: roomId,
            role: "partner"
        })

        if (!partner) {
            return Response.json(
                { message: "partner not found" },
                { status: 400 }
            )
        }

        if (action === "approved") {
            partner.videoKycStatus = "approved"
            partner.videoKycRejectionReason = undefined
            partner.partnerOnBoardingSteps = 5
        }

        if (action === "reject") {
            if (!reason) {
                return Response.json(
                    { message: "rejection reason is required" },
                    { status: 400 }
                )
            }

            partner.videoKycStatus = "reject"
            partner.videoKycRejectionReason = reason.trim()
        }

        await partner.save();

        return Response.json(
            { status: partner.videoKycStatus},
            { status: 200 }
        )
    } catch (error) {
        return Response.json(
            { message: `Kyc Complete Error ${error}` },
            { status: 500 }
        )
    }
}