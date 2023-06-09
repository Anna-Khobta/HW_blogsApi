
import {NextFunction, Request, Response} from "express";

// authentication middleware

export const authorizationMiddleware = ((req: Request, res:Response, next:NextFunction) => {

    const auth = {login: 'admin', password: 'qwerty'} // can change this

if (typeof req.headers.authorization !== "undefined") {
    if ('Basic' === ((req.headers.authorization).split(' ')[0])) {

        const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
        const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

        // Verify login and password are set and correct
        if (login && password && login === auth.login && password === auth.password) {
            return next()
        }
    }
}
    res.sendStatus(401) // custom message

//GMT express deprecated res.send(status): Use res.sendStatus(status) instead
})



