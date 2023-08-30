import { Router } from "express";
import { sessionsController } from "../controllers/sessions.controller.js";
import passport from "passport";
const router = Router()

//Ruta para comprobar en base de datos si el usuario existe o si es un admin y setearlo a su respectiva sesion
router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/failureLogin" }), sessionsController.login)

//Ruta para crear un usuario en base de datos
router.post("/signup", passport.authenticate("signup", { failureRedirect: "/api/sessions/failureSignup" }), sessionsController.signup);

//Ruta para eliminar la sesion actual
router.get("/logout", sessionsController.logout)

//Ruta para cambiar la contraseña
router.put("/forgot", sessionsController.forgot)

//Rutas en caso de que exista un error en la autenticacion de passport
router.get("/failureLogin", (req, res) => {
    res.status(401).json({ message: "Credenciales Incorrectas!" })
})

router.get("/failureSignup", (req, res) => {
    res.status(401).json({ message: "Email en uso o edad incorrecta!" })
})

//Rutas de GITHUB
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {
    res.status(200).send("success")
})

router.get("/githubCallback", passport.authenticate("github", { failureRedirect: "/api/sessions/failureLogin" }), sessionsController.login)
export default router