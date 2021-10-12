const {User,validate}=require("../Models/user");
const bcrypt=require('bcrypt');
var jwt=require("jsonwebtoken");
var key="ssecretkey";
require('dotenv').config();

exports.signup=async (req,res,next)=>{
    const {error}=validate(req.body);
    if(error) return res.status(400).json({errorMessage:error.details.map(err=>err.message)})
   
    var user=await User.find({Email:req.body.Email})
    if(user.length>0) return  res.json({message:"user already exist"});
    
    var register=new User({
        UserName:req.body.UserName,
        Email:req.body.Email,
        Password:req.body.Password,
        ConfirmPassword:req.body.ConfirmPassword
    })
    const salt=await bcrypt.genSalt(10);
    register.Password=await bcrypt.hash(register.Password,salt);
    register.ConfirmPassword=await bcrypt.hash(register.ConfirmPassword,salt);
    const data=await register.save().then(result=>{
        res.status(200).json({message:"user registered successfully",userList:result})
    }).catch((err)=>{
        console.log(err);
    })
}



exports.login=async (req,res,next)=>{
    var getUser=await User.find({Email:req.body.Email})
    if(!getUser || !getUser.length){
       return res.json({msg:"User does not Exist"})
    }
    const loggedIn= await bcrypt.compare(req.body.Password,getUser[0].Password)
    if(loggedIn){
        var userobj={
            email:req.body.Email
        }
        jwt.sign({userdetails:userobj},key,(err,token)=>{
            process.env.User_Name=getUser[0].UserName;
            process.env.User_Token=token;
            return res.status(200).json({msg:"Loggin successfully",userToken:token,username:getUser[0].UserName});
        })
    }else{
        return res.json({msg:"Invalid user"});
    }
}

exports.Auth=(req,res,next)=>{
    res.status(200).json({userName:process.env.User_Name,usertoken:process.env.User_Token})
}

exports.forgetPassword=async (req,res,next)=>{
    var getUsername=await User.find({Email:req.body.Email})
    if(!getUsername || !getUsername.length){
        return res.json({msg:"User does not Exist"});
    }else{
        res.json({id:getUsername[0]._id});
    }
}
exports.newPassword=async (req,res,next)=>{
    const salt=await bcrypt.genSalt(10);
    req.body.Password=await bcrypt.hash(req.body.Password,salt);
    const user=await User.findById({_id:req.params.id})
    const username=user.Email;
   const updatePassword=await User.updateOne({_id:req.params.id},{$set:{Email:username,Password:req.body.Password}})
    return res.json({msg:"password updated successfully"});
}






