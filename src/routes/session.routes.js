import { Router } from "express";
import { destroySession, isLogin, testLogin} from "../controllers/session.controller.js";
import passport from "passport";
const routerSession = Router()

routerSession.post("/login", passport.authenticate('login'), testLogin)
routerSession.get("/login",isLogin,(req,res)=>{
    if(!req.session.user)
        res.render("login", {})
})
routerSession.get("/logout", destroySession)


export default routerSession