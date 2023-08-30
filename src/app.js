import express from "express"
import mongoose from "mongoose"
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js"
import { Server } from "socket.io"
import socket from "./utils/socket.js"
import * as dotenv from "dotenv"
import routerProducts from "./router/products.router.js"
import routerCarts from "./router/carts.router.js"
import routerViews from "./router/views.router.js"
import routerSessions from "./router/sessions.router.js"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import { auth } from "./middlewares/auth.js"


const app = express()

//VARIABLES DE ENTORNO

dotenv.config()
const port = process.env.PORT
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_DB = process.env.MONGO_DB

//CONEXION A BASE DE DATOS

const environment = async () => {
    await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@coder.amwd2xp.mongodb.net/${MONGO_DB}`)
        .then(() => {
            console.log("DB IS CONNECTED");
        })
        .catch((error) => {
            console.log(error);
            process.exit()
        })

}

//CONFIG

app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@coder.amwd2xp.mongodb.net/${MONGO_DB}`,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 200
    }),
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

//HANDLEBARS

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

//ENDPOINTS

app.use("/api/products", auth, routerProducts)
app.use("/api/carts", auth, routerCarts)
app.use("/api/sessions", routerSessions)
app.use("/", routerViews)

//SOCKET IO

const httpServer = app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
})

const io = new Server(httpServer)
socket(io)

// CORRIENDO DB
environment()