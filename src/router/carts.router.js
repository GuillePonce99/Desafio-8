import { Router } from "express";
//import { addCart, getCart, addProductToCart } from "../controllers/carts.controller.js";
import { cartsController } from "../controllers/carts.controller.js"
const router = Router()


//CARTS EN FS
/*
router.post("/", addCart)
router.get("/:cid", getCart)
router.post("/:cid/product/:pid", addProductToCart)
*/
//CARTS EN DB



router.get("/", cartsController.getCarts)

router.get("/:cid", cartsController.getCartById)

router.post("/", cartsController.addCart)

router.post("/:cid/product/:pid", cartsController.addProductToCart)

router.delete("/:cid", cartsController.deleteCart)

router.delete("/:cid/products", cartsController.deleteAllProductsFromCart)

router.delete("/:cid/products/:pid", cartsController.deleteProductsFromCart)

router.put("/:cid/products/:pid", cartsController.updateQuantity)

export default router