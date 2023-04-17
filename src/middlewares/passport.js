import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { ErrorDeAutenticacion } from "../errors/errorDeAutenticacion.js"
import userModel from "../models/userModel.js"
import {igualarHasheados} from "../middlewares/bcrypt.js"
import {Strategy as GithubStrategy} from "passport-github2"
import { githubCallbackUrl, githubClientId, githubClientSecret } from "../config/auth.js"
import { User } from "../models/User.js"

passport.use("local", new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
    const rol = "admin"    
    let user = await userModel.findOne({email: username})
    
    if(!user && username == "adminCoder@coder.com" && password == "adminCod3r123"){ user = {
        firstName: "coderhouse",
        email: username,
        password: password,
        rol: rol,
    }}    
    if(!user){return done(new ErrorDeAutenticacion())}
    if(user.password != "adminCod3r123"){if(!igualarHasheados(password,user.password)){return done(new ErrorDeAutenticacion())}}
    if(user.password != "adminCod3r123"){delete user.password}
    done(null, user)    
}))

passport.use("github", new GithubStrategy({
    clientID: githubClientId,
    clientSecret: githubClientSecret,
    callbackURL: githubCallbackUrl
}, async(accessToken,refreshToken,profile,done) => {
    let user
    try{
        user = await userModel.findOne(profile.username)
    } catch(error){
        user = new User({
            email: profile.username,
        })
        await userModel.create(user)
    }
}))

passport.serializeUser((user, next) => {
    next(null, user['email'])
})

passport.deserializeUser((username, next) => {
    const user = userModel.findOne({email: username})
    next(null, user)
})

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();

export const autenticacionUserPass = passport.authenticate("local", {failWithError: true})
export const autenticacionPorGithub = passport.authenticate("github", {scope: ["user:email"]})
export const autenticacionPorGithub_CB = passport.authenticate("github", {failWithError: true})