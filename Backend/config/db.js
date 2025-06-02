import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Database connected successfullly")
    }).catch((err) => {
        console.log(`Database connection error: ${err}`)
    })
}

export default connectDB;