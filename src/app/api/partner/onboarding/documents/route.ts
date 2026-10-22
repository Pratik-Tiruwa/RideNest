import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {

    try {
        await connectDb();
        const session = await auth();
        if (!session || !session.user?.email) {
            return Response.json({ message: "unauthorized" }, { status: 400 })
        }

        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return Response.json(
                { message: "user not found" },
                { status: 400 }
            )
        }

        const formdata = await req.formData()
        const aadhar = formdata.get("aadhar") as Blob | null
        const license = formdata.get("license") as Blob | null
        const rc = formdata.get("rc") as Blob | null

        if (!aadhar || !license || !rc) {
            return Response.json(
                { message: "Please Upload Documents" },
                { status: 400 }
            )
        }

        const aadharBuffer = Buffer.from(await aadhar.arrayBuffer());
        const licenseBuffer = Buffer.from(await license.arrayBuffer());
        const rcBuffer = Buffer.from(await rc.arrayBuffer());

        if (
            aadharBuffer.equals(licenseBuffer) ||
            aadharBuffer.equals(rcBuffer) ||
            licenseBuffer.equals(rcBuffer)
        ) {
            return Response.json(
                { message: "Duplicate documents detected. Please upload distinct documents for Aadhaar, Driving License, and Vehicle RC." },
                { status: 400 }
            )
        }

        const updatePayload: any = {
            status: "pending"
        }

        if (aadhar) {
            const url = await uploadOnCloudinary(aadhar)
            if (!url) {
                return Response.json(
                    { message: "aadhar upload failed" },
                    { status: 500 }
                )
            }
            updatePayload.aadharUrl = url
        }

        if (license) {
            const url = await uploadOnCloudinary(license)
            if (!url) {
                return Response.json(
                    { message: "license upload failed" },
                    { status: 500 }
                )
            }
            updatePayload.licenseUrl = url
        }

        
        if (rc) {
            const url = await uploadOnCloudinary(rc)
            if (!url) {
                return Response.json(
                    { message: "rc upload failed" },
                    { status: 500 }
                )
            }
            updatePayload.rcUrl = url
        }


        const partnerDocs = await PartnerDocs.findOneAndUpdate(
            {owner: user._id}, 
            {$set:updatePayload}, 
            {upsert:true, new:true} 
        )

        if(user.partnerOnBoadringSteps<2){
            user.partnerOnBoadringSteps=2
        }

        await user.save(); 

        return Response.json(
            partnerDocs, 
            {status : 201}
        )

    } catch (error) {
        return Response.json(
            {message : `partner docs error ${error}`}, 
            {status : 500}
        )
    }
}