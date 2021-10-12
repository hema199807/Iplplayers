const {Player,validate}=require("../Models/players");

exports.getPlayers=(req,res,next)=>{
   
    Player.find().then((response)=>{
        res.status(200).json({data:response})
    }).catch((err)=>{
        res.status(500).json({message:err})
    })
    
}



exports.getPlayersByTeamName=async (req,res,next)=>{
    
    var playerByTeamName=await Player.find();
    var filterPlayers=playerByTeamName.filter((item)=>{
        if(item.from.toLowerCase()===req.params.teamName.toLowerCase()){
            return item;
        }
    })
   
    if(filterPlayers){
        res.status(200).json({data:filterPlayers});
    }
}

exports.addPlayers=async (req,res,next)=>{
    const {error}=validate(req.body[0]);
    if(error) return res.status(400).json({errorMessage:error.details.map(err=>err.message)})
    
    var player=await Player.find();
    
    var playerByName=player.filter((item) =>{
       let item_playerName=item.playerName.split(" ").join("").toLowerCase().trim();
        let req_playerName=req.body[0].playerName.split(" ").join("").toLowerCase().trim();
       let item_from=item.from.toLowerCase();
        let req_from=req.body[0].from.toLowerCase()
            
        if(item_from==req_from){
            if(item_playerName==req_playerName){
                return item
            }
        }
    })
   
   if(playerByName.length>0) return  res.json({message:"Player already exist"});
   
    const savePlayersData=await new Player({playerName:req.body[0].playerName,from:req.body[0].from,price:req.body[0].price,
    isPlaying:req.body[0].isPlaying,description:req.body[0].description,code:req.body[1].code});
    savePlayersData.save().then(result=>{
        res.status(200).json({playersList:result,message:"Player added successfully"})
    }).catch((err)=>{
        console.log(err);
    })
}