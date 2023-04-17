import express from "express"
import { puerto } from "./config/servidor.js"
import {engine} from "express-handlebars"
import viewsRouter from "./routers/viewsRouter.js"
import sessionRouter from "./routers/sessionRouter.js"
import mongoose from "mongoose"
import MongoStore from "connect-mongo"
import session from "express-session"
import { ATLAS_DIR } from "./config/servidor.js"
import { passportInitialize, passportSession } from "./middlewares/passport.js"

const app = express()
const connection = mongoose.connect(ATLAS_DIR,({
    useNewUrlParser: true,
    useUnifiedTopology: true
}))

app.engine("handlebars", engine())
app.set("views", "./views")
app.set("view engine", "handlebars")

app.use(express.json())
app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }))


app.use(session({
    store: new MongoStore({
        mongoUrl: ATLAS_DIR,
        ttl: 3600
    }),
    secret: "secretito",
    resave: false,
    saveUninitialized: false
}))

app.use(passportInitialize, passportSession)

app.use("/", viewsRouter)
app.use("/api/sessions", sessionRouter)

app.listen(puerto, () => {console.log(`conectado a ${puerto}`)})