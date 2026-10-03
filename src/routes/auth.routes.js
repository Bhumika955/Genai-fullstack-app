const {Router}=require('express')
const authController=require("../controllers/auth.controller")

const authRouter=Router()

authRouter.post("/register",authController.registerUserController)
authRouter.post("/login",authController.LoginUserController)
authRouter.get("/logout",authController.LogoutUserController)
authRouter.get("/getme",authController.GetmeController)

module.exports=authRouter


