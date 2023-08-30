import { Router } from "express";
import { viewsController } from "../controllers/views.controller.js";
import { auth } from "../middlewares/auth.js"
const router = Router()

router.get("/home", viewsController.home)

router.get("/realtimeproducts", auth, viewsController.realtimeproducts)

router.get("/chat", auth, viewsController.chat)

router.get("/products", auth, viewsController.products)

router.get("/carts/:cid", auth, viewsController.carts)

router.get("/signup", viewsController.signup)

router.get("/", viewsController.login)

router.get("/forgot", viewsController.forgot)

export default router