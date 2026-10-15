import mongoose from "mongoose" 

interface IPartnerDocs { 
    owner : mongoose.Types.ObjectId, 
    aadharUrl : string, 
    rcUrl : string, 
    license : string, 
    status : "approved" | "pending" | "rejected", 
    rejectionReason?: string, 
    createdAt : Date, 
    updatedAt : Date
} 


const docsSchema = new mongoose.Schema<IPartnerDocs>({  

    owner : { 
        type : mongoose.Types.ObjectId, 
        ref : "User", 
        require : true
    }, 
    aadharUrl : String, 
    rcUrl : String, 
    license : String,

    status : { 
        type : String, 
        enum : ["approved", "pending", "rejected"], 
        default : "pending"
    }, 
    rejectionReason : String, 


},  {timestamps : true})

const PartnerDocs = mongoose.models. docsSchema || mongoose.model("PartnerDocs", docsSchema) 

export default PartnerDocs;