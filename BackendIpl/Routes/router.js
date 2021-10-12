const express=require("express");
var jwt=require("jsonwebtoken");
var key="ssecretkey";

const PlayersController=require("../Controllers/playersController");
const userController=require('../Controllers/userController');
const CommentsController=require("../Controllers/commentsController");
const router=express.Router();

function verifyToken(req,res,next){
    const bearerHeader=req.headers.authorization;
    if(typeof bearerHeader !== "undefined"){
        const bearerToken=bearerHeader.split("bearer")[1];
        jwt.verify(bearerToken.trim(),key,(err,authData)=>{
            
            if(err){
                res.sendStatus(403);
            }else{
                next()
            }
        })
    }else{
        res.sendStatus(403)
    }
}

router.get("/getPlayers",PlayersController.getPlayers);
router.get("/getPlayersByTeamName/:teamName",PlayersController.getPlayersByTeamName);
router.get("/getPlayersByTeamNameAuth/:teamName",verifyToken,PlayersController.getPlayersByTeamName);
router.post("/addPlayers",PlayersController.addPlayers);
router.get("/getComments",verifyToken,CommentsController.getComments);
router.post("/signup",userController.signup);
router.post("/login",userController.login);
router.get("/auth",userController.Auth);
router.post("/forgetpassword",userController.forgetPassword);
router.post("/updatePassword/:id",userController.newPassword);
module.exports=router;
