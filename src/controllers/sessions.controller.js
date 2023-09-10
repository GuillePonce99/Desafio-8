import UserModel from "../dao/models/users.model.js"
import { createHash, generateToken, isValidPassword } from "../utils.js"

export class sessionsController {

    static login = async (req, res) => {
        const { email, password } = req.body

        try {
            const user = await UserModel.findOne({ email })
            if (user === null) {
                return res.sendUserError({ message: "Email incorrecto!" })
            } else if (!isValidPassword(password, user)) {
                return res.sendUserError({ message: "Contraseña incorrecta!" })
            }

            let token = generateToken({
                email,
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                role: "user"
            })

            res.cookie("coderCookieToken", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true
            }).sendSuccess()

        } catch (error) {
            res.sendServerError(error)
        }

    }

    static loginGitHub = async (req, res) => {
        const user = req.user
        try {
            let token = generateToken({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                role: "user"
            })

            res.cookie("coderCookieToken", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true
            }).redirect("/products")

        } catch (error) {
            res.sendServerError(error)
        }

    }

    static signup = async (req, res) => {
        const { firstName, lastName, age, email, password } = req.body
        try {
            const repetedEmail = await UserModel.findOne({ email })

            if (repetedEmail) {
                return res.sendUserError({ message: "El email ingresado ya existe!" })
            }

            if (age <= 0 || age >= 100) {
                return res.sendUserError({ message: "Ingrese una edad correcta!" })
            }


            const user = {
                firstName,
                lastName,
                age,
                email,
                password: createHash(password),
                role: "user"
            }

            const result = await UserModel.create(user)

            res.sendSuccess({ result })
        } catch (error) {
            res.sendServerError(error)
        }
    }

    static forgot = async (req, res) => {

        const { email, newPassword } = req.body

        try {
            const user = await UserModel.findOne({ email })

            if (!user) {
                return res.sendUserError({ message: "Email incorrecto!" })
            }

            user.password = createHash(newPassword)

            await user.save()


            return res.sendSuccess({ message: "Se ha cambiado la contraseña" })


        }
        catch (error) {
            res.sendServerError(error)
        }
    }

    static logout = async (req, res) => {
        res.sendSuccess()
    }
}