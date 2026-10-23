import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    try {
        await connectDb();
        const session = await auth();
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return Response.json(
                { message: "unauthorized" },
                { status: 400 }
            )
        }

        const totalPartners = await User.countDocuments({ role: "partner" });
        const totalApprovedPartners = await User.countDocuments({ role: "partner", partnerStatus: "approved" });
        const totalPendingPartners = await User.countDocuments({ role: "partner", partnerStatus: "pending" });
        const totalRejectedPartners = await User.countDocuments({ role: "partner", partnerStatus: "rejected" });


        const pendingPartnerUsers = await User.find({
            role: "partner",
            partnerStatus: "pending",
            partnerOnBoardingSteps: 3
        })

        const partnerIds = pendingPartnerUsers.map((p) => p._id)
        const partnerVehicles = await Vehicle.find({
            owner: { $in: partnerIds }
        })

        const vehicleTypeMap = new Map(
            partnerVehicles.map((v) => [String(v.owner), v.type])
        )

        const pendingPartnerReviews = pendingPartnerUsers.map((p) => ({
            _id: p.id,
            name: p.name,
            email: p.email,
            vehicleType: vehicleTypeMap.get(String(p._id))
        }))

        return NextResponse.json(
            {
                stats: {
                    totalPartners,
                    totalApprovedPartners,
                    totalPendingPartners,
                    totalRejectedPartners
                },
                pendingPartnerReviews
            },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: `Admin Dashbaord Erro ${error}` },
            { status: 500 }
        )
    }
}