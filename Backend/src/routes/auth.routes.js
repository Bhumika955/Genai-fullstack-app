const {Router}=require('express')
const authController=require("../controllers/auth.controller")
const authMiddleware=require("../middlewares/auth.middleware")
const authRouter=Router()

authRouter.post("/register",authController.registerUserController)
authRouter.post("/login",authController.LoginUserController)
authRouter.get("/logout",authController.LogoutUserController)
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)

module.exports=authRouter


