import {Router} from "express"

const router = Router()

router.get("/registro", (req,res,next) => {
    res.render("register", {pageTitle: "Registro"})
})

router.get("/login", (req,res,next) => {
    res.render("login", {pageTitle: "Login"})
})

router.get("/", (req,res,next) => {
    res.redirect("/user")
})

router.get("/user", (req,res,next) => {
    res.render("user", {pageTitle: "User", user: req.session.user})
})

export default router