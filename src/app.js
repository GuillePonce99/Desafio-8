import express from "express"
import mongoose from "mongoose"
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js"
import { Server } from "socket.io"
import socket from "./utils/socket.js"
import * as dotenv from "dotenv"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import cookieParser from "cookie-parser"

import CartsRouter from "./routes/carts.router.js"
import ProductsRouter from "./routes/products.router.js"
import ViewsRouter from "./routes/views.router.js"
import SessionRouter from "./routes/sessions.router.js"

const app = express()

//VARIABLES DE ENTORNO

dotenv.config()
const PORT = process.env.PORT
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

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())

//HANDLEBARS

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

//ENDPOINTS

const routerCarts = new CartsRouter()
app.use("/api/carts", routerCarts.getRouter())

const routerProducts = new ProductsRouter()
app.use("/api/products", routerProducts.getRouter())

const routerViews = new ViewsRouter()
app.use("/", routerViews.getRouter())

const routerSessions = new SessionRouter()
app.use("/api/sessions", routerSessions.getRouter())

app.use("*", (req, res) => {
    res.render("404", { style: "error.css" })
})



//SOCKET IO

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
})

const io = new Server(httpServer)
socket(io)

// CORRIENDO DB
environment()