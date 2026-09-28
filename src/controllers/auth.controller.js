const userModel=require("../models/user.model")


async function registerUserController(req,res){
    const {username,email,password}=req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message:"please provide username or email or password"
        })
    }
}


module.exports={
    registerUserController
}