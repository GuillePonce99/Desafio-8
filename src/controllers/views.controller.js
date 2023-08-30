import { ProductManager } from "../dao/fileSystem/ProductManager.js"
import { productsController } from "./product.controller.js"
import { cartsController } from "./carts.controller.js"


const miProducto = new ProductManager("productos.json")


export class viewsController {

    static home = async (req, res) => {
        const productos = await miProducto.getProducts()
        res.render("home", { productos, style: "styles.css", title: "PRODUCTOS" })
    }

    static chat = async (req, res) => {
        res.render("chat", { style: "chat.css", title: "CHAT" })
    }

    static realtimeproducts = async (req, res) => {
        res.render("realTimeProducts", { style: "styles.css", title: "PRODUCTOS-REAL-TIME" })
    }

    static products = async (req, res) => {
        const data = await productsController.getProductsView(req, res)
        res.render("products", { style: "styles.css", title: "PRODUCTOS", data })
    }

    static carts = async (req, res) => {
        const data = await cartsController.getCartByIdView(req, res)

        res.render("carts", { style: "styles.css", title: "CARRITO", data })
    }

    static signup = async (req, res) => {
        res.render("signup", { style: "login.css" })
    }

    static login = async (req, res) => {
        res.render("login", { style: "login.css" })
    }

    static forgot = async (req, res) => {
        res.render("forgot", { style: "login.css" })
    }

}



