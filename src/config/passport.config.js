import passport from "passport";
import local from "passport-local"
import jwt from "passport-jwt"
import GitHubStrategy from "passport-github2"
import UserModel from "../dao/models/users.model.js";
import { PRIVATE_KEY } from "../utils.js";
import * as dotenv from "dotenv"

dotenv.config()
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"]
        return token
    } else {
        return token
    }
}

const initializePassport = () => {
    /*
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
    */

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

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
}
export default initializePassport