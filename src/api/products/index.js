import express from 'express';
import { checkSchema } from 'express-validator/check';
import { handleValidationError } from '../../middlewares/error-handling';
import authMW from '../../middlewares/auth';

import { getAllProducts, searchProduct, productsForProvider, updateProduct } from './handlers';

import { searchProductSchema, providerProductsSchema } from './schemas'

const router = express.Router()

router.get('/all', authMW, getAllProducts);

router.get('/provider/:provider', [
    authMW,
    checkSchema(providerProductsSchema),
    handleValidationError,
] ,productsForProvider)

router.get('/search/:term', [
    authMW,
    checkSchema(searchProductSchema),
    handleValidationError,
], searchProduct);

router.put('/', [
    authMW,
], updateProduct)

export default router;