import UserModel from "../dao/models/users.model.js"
import { createHash } from "../utils.js"

export class sessionsController {

    static login = async (req, res) => {

        if (req.user.email === "adminCoder@coder.com") {

            req.session.user = {
                email: req.user.email,
                role: "Admin",
                counter: 0,
                isAdmin: true
            }
        } else {
            req.session.user = {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                age: req.user.age,
                role: "Usuario",
                counter: 0,
                isAdmin: false
            }

        }

        res.redirect("/products")
    }

    static signup = async (req, res) => {
        res.status(200).send("success")
    }

    static logout = async (req, res) => {
        req.session.destroy((error) => {
            if (error) {
                res.status(500).send("ERROR")
            } else {
                res.status(200).send("OK")
            }
        })
    }

    static forgot = async (req, res) => {

        const { email, newPassword } = req.body

        try {
            const user = await UserModel.findOne({ email })

            if (!user) {
                return res.status(404).json({ message: "Email incorrecto!" })
            }

            user.password = createHash(newPassword)

            await user.save()


            return res.status(200).json({ message: "Se ha cambiado la contraseña" })


        }
        catch (error) {
            res.status(500).json({
                message: "error",
                error: error
            })
        }
    }
}