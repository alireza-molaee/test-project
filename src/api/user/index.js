import express from 'express';
import { checkSchema } from 'express-validator/check';
import { handleValidationError } from '../../middlewares/error-handling';
import {verifyExpiredJWT_MW} from '../../middlewares/auth';

import {
    refreshToken,
    login,
    register,
    verifyUser
} from './handlers';

import {
    loginSchema,
    registerSchema,
    verifyUserSchema
} from './schemas'

const router = express.Router()

router.post('/login', [
    checkSchema(loginSchema),
    handleValidationError,
], login);

router.post('/register', [
    checkSchema(registerSchema),
    handleValidationError,
], register);

router.post('/verification', [
    checkSchema(verifyUserSchema),
    handleValidationError,
], verifyUser);

router.get('/refresh-token', verifyExpiredJWT_MW, refreshToken);

export default router;