const express=require("express");
const mongoose=require("mongoose");
var Approuter=require("./Routes/router");
const bodyParser=require("body-parser");
var Comments=require("./Models/Comments");


const cors=require("cors");
const { Server } = require("socket.io");
require('dotenv').config()
var password=process.env.Atlas_Password;
var port=process.env.PORT||8080;
var app=express();
var server=require("http").createServer(app);
const io=require("socket.io")(server);

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers','content-type,Authurization');
    next();
})
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.json());

const dbUri=`mongodb+srv://root:${password}@cluster0.29oaz.mongodb.net/playersDb?retryWrites=true&w=majority`;
const options={
    useNewUrlParser:true,
    useUnifiedTopology:true
}

app.use("/",Approuter);

app.set("view engine","jade");
app.get("/details",(req,res)=>{
    res.render("details")
})


io.on('connection',socket=>{
    socket.on('new-Comment',async function(message){
        var postComments=await new Comments({
            CommenterName:message.CommenterName,
            PlayerId:message.PlayerId,
            Message:message.Message,
            TimeStamp:message.TimeStamp
        }).save()
        var getnewComment=await Comments.find().sort({TimeStamp:-1});
    
        io.emit('new-comment',getnewComment);
    })
    socket.on('delete-comment',async function(playerId){
        var deleteComment=await Comments.deleteOne( { _id: playerId} );

        var afterDeleteCommentData=await Comments.find().sort({TimeStamp:-1});
        
        io.emit('afterDeleteComment',afterDeleteCommentData);
    })
    
})


mongoose.connect(dbUri,options).then(() =>{
    server.listen(port,()=> console.log("server running"));
}).catch((err)=>{
    console.log(err);
})
