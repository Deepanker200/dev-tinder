const mongoose=require('mongoose');

const connectDB=async()=>{
    //Connecting with cluster
    await mongoose.connect(process.env.DB_CONNECTION_SECRET)
}

module.exports=connectDB;

