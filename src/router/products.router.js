import { Router } from "express";
import { productsController } from "../controllers/product.controller.js"

const router = Router()

router.get("/", productsController.getProducts)

router.get("/:pid", productsController.getProductById)

router.post("/", productsController.addProduct)

router.delete("/:pid", productsController.deleteProduct)

router.put("/:pid", productsController.updateProduct)


export default router