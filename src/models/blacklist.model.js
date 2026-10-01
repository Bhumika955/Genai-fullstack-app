const mongoose=require("mongoose")

const blacklistTokenSchema=new mongoose.Schema({
    type:String,
    required:[true,"token is required to added in blacklist"]
})


