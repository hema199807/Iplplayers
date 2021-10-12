const mongoose=require("mongoose");


const commentsSchema=new mongoose.Schema({
    CommenterName:String,
    PlayerId:String,
    Message:String,
   
},{strict:false})

const Comments=mongoose.model("comments",commentsSchema);

module.exports=Comments
