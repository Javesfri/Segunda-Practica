import { Router } from "express";
import passport from "passport";

const routerGithub = Router()

//Register
routerGithub.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

//Login
routerGithub.get("/githubSession", passport.authenticate('github'), async (req, res) => {
    console.log(req.user.first_name)
    req.session.user = {
        first_name: req.user.first_name,
        last_name:req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol:req.user.rol

    }

    res.redirect('/api/products')
})

export default routerGithub