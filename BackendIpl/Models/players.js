const mongoose=require("mongoose");
const joi=require("joi");

const playersSchema=new mongoose.Schema({
    playerName:String,
    from:String,
    price:String,
    isplaying:Boolean,
    description:String
},{strict:false})

const Player=mongoose.model("player",playersSchema);

function validate(player){
    const joiSchema=joi.object({
        playerName:joi.string().trim(true).required().min(3).max(50),
        from:joi.string().trim(true).required(),
        price:joi.string().trim(true).required(),
        isPlaying:joi.required().valid(true,false),
        description:joi.string().trim(true).required()
    }).options({abortEarly:false})
    return joiSchema.validate(player)
}

module.exports={Player,validate}
