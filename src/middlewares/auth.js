
export const auth = async (req, res, next) => {
    if (req.session?.passport) {
        next()
    } else {
        res.redirect("/")
    }
}
