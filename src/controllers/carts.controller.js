//import CartManager from "../manager/CartManager.js"
import ProductModel from "../dao/models/products.model.js"
import CartsModel from "../dao/models/carts.model.js"



// CONTROLLER FS

/*
let miCarrito = new CartManager.CartManager("./carrito.json")

export const addCart = async (req, res) => {

    try {
        await miCarrito.addCart()
        res.json({ status: 200, mensaje: "CARRITO CREADO" })
    }
    catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
}

export const getCart = async (req, res) => {
    const { cid } = req.params
    try {
        let carrito = await miCarrito.getCartsById(Number(cid))

        res.json({ status: 200, mensaje: `CARRITO N° ${cid}`, data: carrito.products })
    }
    catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
}

export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params

    try {
        await miCarrito.addProductToCart(Number(cid), Number(pid))
        let carrito = await miCarrito.getCartsById(Number(cid))
        res.json({ status: 200, mensaje: `Producto ID: ${pid} agregado al carrito n° ${cid}`, data: carrito.products })
    }
    catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
}
*/

//CONTROLLER DB

export class cartsController {
    static getCarts = async (req, res) => {
        try {
            let carrito = await CartsModel.find()

            res.status(200).json({ mensaje: `TODOS LOS CARRITOS`, carritos: carrito })
        }
        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }

    }
    static getCartById = async (req, res) => {
        const { cid } = req.params

        try {
            const carrito = await CartsModel.findById(cid)

            if (carrito === null) {
                res.status(404).json({ mensaje: `Not Found` })
            } else {
                res.status(200).json({ mensaje: `CARRITO N° ${cid}`, products: carrito.products })
            }
        }

        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }

    }
    static addCart = async (req, res) => {

        try {
            const cart = new CartsModel()
            await cart.save()

            res.status(200).json({ mensaje: `CARRITO CREADO ID: ${cart._id}`, id: cart._id })
        }
        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }
    }
    static addProductToCart = async (req, res) => {
        const { cid, pid } = req.params

        try {

            let carrito = await CartsModel.findOne({ _id: cid })

            let producto = await ProductModel.findOne({ _id: pid })

            if (carrito === null) {
                return res.status(404).json({ error: "Cart Not Found" })
            } else if (carrito === null || producto === null) {
                return res.status(404).json({ error: "Product Not Found" })
            }

            const productIndex = carrito.products.findIndex(e => e.product._id.equals(producto._id))

            if (productIndex === - 1) {
                carrito.products.push({ product: pid, quantity: 1 })
            } else {
                carrito.products[productIndex].quantity++
            }

            await CartsModel.updateOne({ _id: cid }, carrito)

            const actualizado = await CartsModel.findById(cid)

            res.status(200).json({ mensaje: `Carrito actualizado`, data: actualizado })



        }
        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
            console.log(error);

        }
    }
    static deleteCart = async (req, res) => {
        const { cid } = req.params

        try {
            const eliminado = await CartsModel.deleteOne({ _id: cid })

            if (eliminado.deletedCount) {
                res.status(200).json({ mensaje: `CARRITO N° ${cid} ELIMINADO` })
            } else {
                res.status(404).json({ mensaje: `Not Found` })
            }
        }

        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }

    }
    static deleteAllProductsFromCart = async (req, res) => {
        const { cid } = req.params

        try {
            const carrito = await CartsModel.updateOne({ _id: cid }, { products: [] })

            carrito.matchedCount === 0
                ?
                res.status(404).json({ mensaje: `Not Found` })
                :
                res.status(200).json({ mensaje: `CARRITO N° ${cid} VACIO` })
        }

        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }

    }
    static deleteProductsFromCart = async (req, res) => {

        const { cid, pid } = req.params

        try {
            const carrito = await CartsModel.findById(cid)

            if (carrito === null) {
                return res.status(404).json({ error: "Not Found" })
            }

            const productIndex = carrito.products.findIndex((e) => e.product._id.equals(pid))

            if (productIndex === -1) {
                return res.status(404).json({ error: "Not Found" })
            }

            carrito.products.splice(productIndex, 1)

            await CartsModel.updateOne({ _id: cid }, carrito, { new: true })

            res.status(200).json({ mensaje: `PRODUCTO ID: ${pid} ELIMINADO DEL CARRITO` })

        }

        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }

    }
    static updateQuantity = async (req, res) => {
        const { cid, pid } = req.params
        const { quantity } = req.body

        try {

            const carrito = await CartsModel.findById(cid)

            if (carrito === null) {
                return res.status(404).json({ error: "Cart Not Found" })
            }

            const productIndex = carrito.products.findIndex((e) => e.product._id.equals(pid))

            if (productIndex === -1) {
                return res.status(404).json({ error: "Product Not Found" })
            }

            carrito.products[productIndex].quantity += Number(quantity)

            const actualizado = await CartsModel.updateOne({ _id: cid }, carrito)


            res.status(200).json({ mensaje: `CANTIDAD ACTUALIZADA : ${quantity}`, data: actualizado })
        }

        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }

    }
    static getCartByIdView = async (req, res) => {

        const { cid } = req.params

        try {
            const carrito = await CartsModel.findById(cid)

            if (!carrito) {
                res.status(404).json({ message: "Not Found" })
            }

            const products = carrito.products.map((e) => ({
                product: {
                    _id: e.product._id,
                    title: e.product.title,
                    description: e.product.description,
                    code: e.product.code,
                    price: e.product.price,
                    stock: e.product.stock,
                    category: e.product.category,
                    status: e.product.status,
                    thumbnails: e.product.thumbnails
                },
                quantity: e.quantity
            }))

            let status = true

            if (products.length <= 0) {
                status = false
            }

            const resolve = {
                status,
                _id: carrito._id,
                products
            }

            return resolve

        }
        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }
    }

}

