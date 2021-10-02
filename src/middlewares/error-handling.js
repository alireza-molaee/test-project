import { MongoError } from 'mongodb';
import { validationResult } from 'express-validator/check';

export default function errorHandler (err, req, res, next) {
    console.error(err);
    if (err instanceof MongoError) {
        res.status(503).send({message: 'Something wrong in database!'})
    } else if (!err.statusCode) {
        res.status(500).send({message: 'Something failed!'});
    } else if (err.statusCode === 400) {
        res.status(400).send({message: err.message, errors: err.errors})
    } else {
        res.status(err.statusCode).send({message: err.message});
    }
    next(err);
}

export function handleValidationError(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed');
        error.statusCode = 400;
        error.errors = errors.mapped();
        throw error;
    } else {
        next();
    }
}