import {
    Router
} from "express"
import userModel from "../models/userModel.js"
import {
    hashear
} from "../middlewares/bcrypt.js"
import passport from "passport"
import { autenticacionPorGithub, autenticacionPorGithub_CB } from "../middlewares/passport.js"


const sessionRouter = Router()

sessionRouter.post("/register", async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            age,
            password
        } = req.body
        const existe = await userModel.findOne({
            email
        })
        if (existe) {
            return res.status(400).send({
                status: "error",
                error: "Este mail ya esta registrado"
            })
        }
        const user = {
            firstName,
            lastName,
            email,
            age,
            password: hashear(password),
        }

        let result = await userModel.create(user)
        console.log(result)

        req.session.user = {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            age: user.age,
            rol: "usuario"
        }

        console.log(req.session.user)
        
        res.status(201).send({
            status: "success",
            message: "Usuario Registrado!"
        })


    } catch (error) {
        next(error)
    }
})

sessionRouter.post("/login", passport.authenticate("local"), async(req,res) => {
    if(!req.user) return res.status(400).send({status: "error", error:"Invalid"})
    
    const email = req.user.email
    let user = await userModel.findOne({email})
    if(user){req.session.user = {
        name: `${user.firstName} ${user.lastName}`,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol
    }}
    if(!user && email == "adminCoder@coder.com"){req.session.user = {
        name: "coderhouse",
        email: req.user.email,
        password: req.user.password,
        rol: "admin"
    } 
}
    res.sendStatus(201)
})

sessionRouter.get("/github", autenticacionPorGithub)
sessionRouter.get("/githubcallback", autenticacionPorGithub_CB, (req,res,next) => {res.redirect("/user")})

sessionRouter.get('/logout', (req, res) => {
    req.logout(err => {
        res.sendStatus(200)
    })
})

export default sessionRouter