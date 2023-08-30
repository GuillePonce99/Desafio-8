//import ProductManager from "../manager/ProductManager.js";
import ProductModel from "../dao/models/products.model.js";

/*
let miProducto = new ProductManager.ProductManager("productos.json")

//CONTROLLERS FS

export const getProducts = async (req, res) => {
    const productos = await miProducto.getProducts()
    const { limit } = req.query
    const response = await productos.slice(0, limit)
    try {
        if (limit) {
            res.json(response)
        } else {
            res.json(productos)
        }
    }
    catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
}


export const getProduct = async (req, res) => {
    const { pid } = req.params

    try {
        res.send(await miProducto.getProductsById(Number(pid)))
    }
    catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
}

export const addProduct = async (req, res) => {
    const { id, title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(401).json({ message: "Faltan datos" });
    }
    if (!thumbnails) {
        req.body.thumbnail = "";
    }
    if (status === undefined) {
        req.body.status = true
    }
    if (id) {
        return res.status(401).json({ message: "No incluir ID" });
    }

    req.body.code = req.body.code.toString()
    try {
        await miProducto.addProduct(req.body)
        res.json({ status: 200, mensaje: "PRODUCTO CARGADO EXITOSAMENTE", data: req.body })
    }
    catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
}

export const updateProduct = async (req, res) => {
    const { pid } = req.params
    if (req.body.code) {
        req.body.code = req.body.code.toString()
    }

    try {
        await miProducto.updateProduct(Number(pid), req.body),
            res.json({ status: 200, mensaje: "PRODUCTO ACTUALIZADO CORRECTAMENTE", data: req.body })
    }
    catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
}

export const deleteProduct = async (req, res) => {
    const { pid } = req.params

    try {
        await miProducto.deleteProduct(Number(pid)),
            res.json({ status: 200, mensaje: "PRODUCTO ELIMINADO" })
    }
    catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
}
*/
//CONTROLLERS DB

export class productsController {
    static getProducts = async (req, res) => {
        let { limit = 10, page = 1, sort, query } = req.query

        try {
            const options = {
                limit,
                page,
                sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined
            }

            const filter = query ? query === "0" ? { stock: 0 } : { category: query } : {}

            let result = await ProductModel.paginate(filter, options)

            let status = result ? "success" : "error"

            let queryFormated = query ? req.query.query.replace(/ /g, "%20") : ""


            let response = {
                status,
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/products?limit=${options.limit}&page=${result.prevPage}&sort=${req.query.sort}${query ? `&query=${queryFormated}` : ""}` : null,
                nextLink: result.hasNextPage ? `/api/products?limit=${options.limit}&page=${result.nextPage}&sort=${req.query.sort}${query ? `&query=${queryFormated}` : ""}` : null

            }

            res.status(200).json({ data: response })
        }
        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
            console.log(error);
        }
    }
    static getProductById = async (req, res) => {
        const { pid } = req.params

        try {
            const product = await ProductModel.findOne({ _id: pid })
            if (!product) {
                return res.status(404).json({ message: "Not Found" });
            }
            const result = await ProductModel.findOne({ _id: pid });
            res.status(200).json({ message: "success", data: result })
        }
        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }

    }
    static addProduct = async (req, res) => {
        const { id, title, description, code, price, status, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || !price || !category) {
            return res.status(401).json({ message: "Faltan datos" });
        }

        if (id) {
            return res.status(401).json({ message: "No incluir ID" });
        }

        const repetedCode = await ProductModel.findOne({ "code": req.body.code })

        if (repetedCode) {
            return res.status(404).json({ message: `Ya existe el producto con el CODE: ${req.body.code}` });
        }

        try {

            const product = {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            }

            const result = await ProductModel.create(product)

            res.status(200).json({ message: "Producto creado exitosamente!", data: result })
        }
        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }
    }
    static deleteProduct = async (req, res) => {
        const { pid } = req.params

        try {
            const product = await ProductModel.findOne({ _id: pid })

            if (!product) {
                return res.status(404).json({ message: "Not Found" });
            }

            const result = await ProductModel.findOneAndDelete({ _id: pid })

            res.status(200).json({ message: "success", data: result })
        }
        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }
    }
    static updateProduct = async (req, res) => {
        const { pid } = req.params

        try {
            const product = await ProductModel.findOne({ _id: pid })

            if (!product) {
                return res.status(404).json({ message: "Not Found" });
            }

            const repetedCode = await ProductModel.findOne({ "code": req.body.code })

            if (repetedCode) {
                return res.status(404).json({ message: `Ya existe el producto con el CODE: ${req.body.code}` });
            }

            const actualizado = await ProductModel.findOneAndUpdate({ _id: pid }, req.body, { new: true })

            res.status(200).json({ mensaje: "PRODUCTO ACTUALIZADO CORRECTAMENTE", data: actualizado })


        }
        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }
    }

    static getProductsView = async (req, res) => {

        let { limit = 10, page = 1, sort, query } = req.query

        try {
            const options = {
                limit,
                page,
                sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined
            }

            const filter = query ? query === "0" ? { stock: 0 } : { category: query } : {}

            let result = await ProductModel.paginate(filter, options)

            const product = result.docs.map((e) => {
                return {
                    _id: e._id,
                    title: e.title,
                    description: e.description,
                    code: e.code,
                    price: e.price,
                    status: e.status,
                    stock: e.stock,
                    category: e.category,
                    thumbnails: e.thumbnails
                }
            })

            let status = result ? "success" : "error"

            let queryFormated = query ? req.query.query.replace(/ /g, "%20") : ""

            const user = await req.session.user

            if (user) {
                user.counter++
            }

            let response = {
                status,
                payload: { product, user },
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/products?limit=${options.limit}&page=${result.prevPage}&sort=${req.query.sort}${query ? `&query=${queryFormated}` : ""}` : null,
                nextLink: result.hasNextPage ? `/products?limit=${options.limit}&page=${result.nextPage}&sort=${req.query.sort}${query ? `&query=${queryFormated}` : ""}` : null
            }

            return response
        }
        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
            console.log(error);
        }
    }

}
