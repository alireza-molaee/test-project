import {User, redisClient} from '../../models';
import { sendSMS } from '../../utils/sms';
import { HttpError } from '../../utils/error';
import validator from 'validator';
import { createJWToken, verifyJWTToken } from '../../utils/auth';


function cacheAnonymousUserAndSendVerificationSms(id, userData, secretCode) {
    const creatAt = new Date().valueOf();
    const cacheUser = {
        phoneNumber: userData.phoneNumber,
        name: userData.name,
        family: userData.family,
        secretCode,
        creatAt
    };
    redisClient.hmset(`user:${id || creatAt}`, cacheUser);
    const smsMessage = `Hello ${userData.name}. \n Your verification code is: ${secretCode}`
    sendSMS(userData.phoneNumber, smsMessage);
    return id || creatAt
}

function createUserResponse(user) {
    if (!user) {
        throw new HttpError(`can not find user with this id "${userId}"`, 404);
    }
    const token = createJWToken({
        id: user.id,
        picture: user.picture,
        name: user.name,
        role: user.role
    });
    return {
        "id": user.id,
        "name": user.name,
        "picture": user.picture,
        "role": user.role,
        "token": token
    };
}

export function login(req, res, next) {
    const { phoneNumber } = req.body;
    const secretCode = Math.floor(Math.random()*90000) + 10000;
    User.findOne({ phoneNumber })
    .then(user => {
        if (!user) {
            throw new HttpError(`can not find user with this phone number "${phoneNumber}"`, 404);
        }
        const id = cacheAnonymousUserAndSendVerificationSms(user.id, user, secretCode);
        res.status(200).send({
            userId: id,
        });
    })
    .catch(err => {
        console.log(err);
        next(err)
    })
}

export function register(req, res, next) {
    const {name, phoneNumber, family} = req.body;
    const secretCode = Math.floor(Math.random()*90000) + 10000;
    User.findOne({phoneNumber})
    .then(user => {
        if (user) {
            throw new HttpError('user exist', 409); 
        }
        const id = cacheAnonymousUserAndSendVerificationSms(null, {
            name,
            phoneNumber,
            family
        }, secretCode);
        res.status(200).send({
            userId: id,
        });
    })
    .catch(err => {
        next(err)
    })
}

export function verifyUser(req, res, next) {
    const { userId, secretCode } = req.body;
    const isSavedUser = validator.isMongoId(userId);
    redisClient.pipeline()
    .hgetall(`user:${userId}`)
    .exec()
    .then((redisRes) => {
        const cacheUser = redisRes[0][1];
        if (!cacheUser.secretCode) {
            throw new HttpError('secret code not set', 400); 
        }

        if (cacheUser.secretCode !== secretCode) {
            redisClient.del(`user:${userId}`);
            throw new HttpError('wrong code', 401); 
        }

        if (isSavedUser) {
            return User.findById(userId);
        } else {
            return User.create({
                phoneNumber: cacheUser.phoneNumber,
                name: cacheUser.name,
            })
        }
    })
    .then(user => {
        const resData = createUserResponse(user);
        res.status(200).send(resData);
    }).catch(err => {
        if (err.name === "MongoError" && err.code === 11000) {
            next(new HttpError('this user registered before', 409));
        } else {
            next(err)
        }
    })
}

export function refreshToken(req, res, next) {
    let user = req.user;
    User.findById(user.id)
    .then(user => {
        const resData = createUserResponse(user);
        res.status(200).send(resData);
    })
    .catch(err => {
        if (err.name === "MongoError" && err.code === 11000) {
            next(new HttpError('this user registered before', 409));
        } else {
            next(err)
        }
    });
}