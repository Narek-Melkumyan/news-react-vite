export function RolesMiddleware (req, res, next) {
    console.log(req.method)
    console.log(req.user)
    if(req.user === "OPTIONS") {

    }


    next()
}