import Routes from "./router.js"
import { cartsController } from "../controllers/carts.controller.js"

export default class CartsRouter extends Routes {
    init() {
        this.get("/", ["USER", "USER_PREMIUM", "ADMIN"], cartsController.getCarts)

        this.get("/:cid", ["USER", "USER_PREMIUM", "ADMIN"], cartsController.getCartById)

        this.post("/", ["USER", "USER_PREMIUM", "ADMIN"], cartsController.addCart)

        this.post("/:cid/product/:pid", ["USER", "USER_PREMIUM", "ADMIN"], cartsController.addProductToCart)

        this.delete("/:cid", ["USER", "USER_PREMIUM", "ADMIN"], cartsController.deleteCart)

        this.delete("/:cid/products", ["USER", "USER_PREMIUM", "ADMIN"], cartsController.deleteAllProductsFromCart)

        this.delete("/:cid/products/:pid", ["USER", "USER_PREMIUM", "ADMIN"], cartsController.deleteProductsFromCart)

        this.put("/:cid/products/:pid", ["USER", "USER_PREMIUM", "ADMIN"], cartsController.updateQuantity)

        this.get("/user/cart", ["USER", "USER_PREMIUM", "ADMIN"], cartsController.getUserCart)
    }
}
