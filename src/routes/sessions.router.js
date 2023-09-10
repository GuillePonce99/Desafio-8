import { sessionsController } from "../controllers/sessions.controller.js";
import { passportCall } from "../utils.js";
import Routes from "./router.js";

export default class SessionRouter extends Routes {
    init() {
        //Rutas de inicio de sesion, y registro
        this.post("/login", ["PUBLIC"], sessionsController.login);

        this.post("/signup", ["PUBLIC"], sessionsController.signup);

        //Ruta para cambiar la contraseña
        this.put("/forgot", ["PUBLIC"], sessionsController.forgot)

        //Ruta para eliminar la sesion actual
        this.get("/logout", ["PUBLIC"], sessionsController.logout)

        //Ruta para obtener el token del request
        this.get("/current", ["USER", "USER_PREMIUM", "ADMIN"], passportCall("jwt"), (req, res) => { res.send(req.user) })

        //Rutas en caso de que exista un error en la autenticacion de passport
        this.get("/failureSignup", ["PUBLIC"], (req, res) => { res.status(401).json({ message: "Email en uso o edad incorrecta!" }) })

        this.get("/failureLogin", ["PUBLIC"], (req, res) => { res.status(401).json({ message: "Credenciales Incorrectas!" }) })

        //Rutas de login con github
        this.get("/github", ["PUBLIC"], passportCall("github", { scope: ["user:email"] }), (req, res) => { res.status(200).send("success") })

        this.get("/githubCallback", ["PUBLIC"], passportCall("github", { failureRedirect: "/api/sessions/failureLogin" }), sessionsController.loginGitHub)
    }
}




