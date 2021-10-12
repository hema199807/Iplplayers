const Comments=require("../Models/Comments");


exports.getComments=(req,res,next)=>{
   
    Comments.find().sort({TimeStamp:-1}).then((response)=>{
        res.status(200).json({data:response})
    }).catch((err)=>{
        res.status(500).json({message:err})
    })
}