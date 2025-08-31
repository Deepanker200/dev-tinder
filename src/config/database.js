const mongoose=require('mongoose');

const connectDB=async()=>{
    //Connecting with cluster
    await mongoose.connect("mongodb+srv://namastedev:GyN3iJ57GbOJewrp@namastenode.2raxarh.mongodb.net/devTinder")
}

module.exports=connectDB;

