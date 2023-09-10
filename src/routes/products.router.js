import Routes from "./router.js"
import { productsController } from "../controllers/product.controller.js"

export default class ProductsRouter extends Routes {
    init() {
        this.get("/", ["USER", "USER_PREMIUM", "ADMIN"], productsController.getProducts)

        this.get("/:pid", ["USER", "USER_PREMIUM", "ADMIN"], productsController.getProductById)

        this.post("/", ["USER", "USER_PREMIUM", "ADMIN"], productsController.addProduct)

        this.delete("/:pid", ["USER", "USER_PREMIUM", "ADMIN"], productsController.deleteProduct)

        this.put("/:pid", ["USER", "USER_PREMIUM", "ADMIN"], productsController.updateProduct)
    }
}

