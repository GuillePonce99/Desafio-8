import passport from "passport";
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import UserModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import * as dotenv from "dotenv"

dotenv.config()
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL
const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        if (id === "admin") {
            const admin = {
                _id: "admin",
                email: "adminCoder@coder.com"
            }
            return done(null, admin)
        } else {
            let user = await UserModel.findById(id)
            done(null, user)
        }
    })


    passport.use("github", new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({ email: profile._json.email })
            const newName = profile._json.name.split(" ")
            const name = newName.splice(0, 1).toString()
            const lastName = newName.join(" ");
            if (!user) {
                let newUser = {
                    firstName: name,
                    lastName: lastName,
                    age: 18,
                    email: profile._json.email,
                    password: ""
                }

                let result = await UserModel.create(newUser)
                return done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.use("signup", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    },
        async (req, username, password, done) => {
            const { firstName, lastName, age, email } = req.body
            try {

                const repetedEmail = await UserModel.findOne({ "email": username })

                if (repetedEmail) {
                    return done(null, false, { message: "El email ingresado ya existe!" })
                }

                if (age <= 0 || age >= 100) {
                    return done(null, false, { message: "Ingrese una edad correcta!" })
                }

                const user = {
                    firstName,
                    lastName,
                    age,
                    email,
                    password: createHash(password)
                }

                const result = await UserModel.create(user)

                return done(null, result)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    },
        async (username, password, done) => {

            try {
                if (username === "adminCoder@coder.com" && password === "adminCod3r123") {

                    const admin = {
                        _id: "admin",
                        email: username
                    }

                    return done(null, admin)
                } else {

                    const user = await UserModel.findOne({ email: username })

                    if (user === null) {

                        return done(null, false)
                    } else if (!isValidPassword(password, user)) {
                        return done(null, false)
                    } else {
                        return done(null, user)
                    }
                }

            } catch (error) {
                return done(error)
            }
        }
    ))

}
export default initializePassport