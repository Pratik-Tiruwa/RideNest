import mongoose from 'mongoose';

const mongodbUrl = process.env.MONGODB_URL

if (!mongodbUrl) {
    throw new Error("db url not found")
}

let cached = global.mongooseConnection
if (!cached) {
    cached = global.mongooseConnection = { connection: null, promise: null }
}

const connectDb = async () => {
    if (cached.connection) {
        // console.log("Cached connection return")
        return cached.connection
    } 

    // if(cached.promise) { 
    //     console.log("Promise Connection")
    // }

    if (!cached.promise) {
        //  console.log("New Connection")
        cached.promise = mongoose.connect(mongodbUrl).then(c => c.connection)
    }

    try {
        const connection = await cached.promise
        return connection
    } catch (error) {
        console.log(error)
    }
}

export default connectDb;