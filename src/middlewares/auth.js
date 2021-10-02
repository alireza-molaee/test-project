import { verifyJWTToken } from '../utils/auth';

export default function verifyJWT_MW(req, res, next) {
    let token = null;
    if (req.headers.authorization === undefined || req.headers.authorization === null) {
        res.sendStatus(401);
    }
    let bits = req.headers.authorization.split(' ');
    if (bits.length !== 2 || !/^Bearer$/i.test(bits[0])) {
        res.sendStatus(401);
    } else {
        token = bits[1];
    }

    if (token) {
        verifyJWTToken(token)
        .then((decodedToken) => {
            req.user = decodedToken.data
            next()
        })
        .catch((err) => {
            res.sendStatus(401);
        })
    } else {
        res.sendStatus(401);
    }
}

export function verifyExpiredJWT_MW(req, res, next){
    let token = null;
    if (req.headers.authorization === undefined || req.headers.authorization === null) {
        res.sendStatus(401);
    }
    let bits = req.headers.authorization.split(' ');
    if (bits.length !== 2 || !/^Bearer$/i.test(bits[0])) {
        res.sendStatus(401);
    } else {
        token = bits[1];
    }

    if (token) {
        verifyJWTToken(token)
        .then((decodedToken) => {
            req.user = decodedToken.data
            next()
        })
        .catch(([err, decodedToken]) => {
            if (err.name && err.name === 'TokenExpiredError') {
                req.user = decodedToken.data
                next()
            } else {
                res.sendStatus(401);
            }
        })
    } else {
        res.sendStatus(401);
    }
}