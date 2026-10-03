const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const tokenBlocklistModel=require("../models/blacklist.model")
async function registerUserController(req,res){
    const {username,email,password}=req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message:"please provide username or email or password"
        })
    }
    const isUserAlreadyExists=await userModel.findOne({
        $or:[{username},{email}]
    })
    if(isUserAlreadyExists){
        if(isUserAlreadyExists.username == username ){
        return res.status(400).json({
            message: "user already exists with this username"
        })
    }
    return res.status(400).json({
            message: "user already exists with this email"
    })
}
const hash=await bcrypt.hash(password,10)
const user=await userModel.create({
    username ,
    email,
    password: hash
 })

    const token=jwt.sign(
        {id:user._id ,username: user.username },
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token",token)

    res.status(200).json({
        message:"User created successfully",
        user:{
            id:user._id,
            email:user.email,
            username:user.username
        }

    })
}

async function LoginUserController(req,res){
    const {email,password}=req.body
     const user= await userModel.findOne({email})
     if(!user){
        return res.status(400).json({
            message: "Invalid email"
        })
     }
 const isPasswordCheck=await bcrypt.compare(password, user.password)
 if(!isPasswordCheck){
    return res.status(400).json({
        message:"Invalid Password"
    })
 }
const token=jwt.sign(
    {id:user._id,username: user.username},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
)
res.cookie("token",token)
res.status(200).json({
    message:"User LoggedIn successfully.",
    user:{
        id:user._id,
        username: user.username,
        email: user.email
    }
})

}

async function LogoutUserController(req,res){
    const token=req.cookies.token
    if(token){
        await tokenBlocklistModel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
        message:"User logged out successfully"
    })
}
module.exports={
    registerUserController,
    LoginUserController,
    LogoutUserController
}