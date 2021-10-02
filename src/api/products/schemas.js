export const searchProductSchema = {
    term: {
        in: ['params'],
        trim: true
    }
}


export const providerProductsSchema = {
    provider: {
        in: ['params'],
        trim: true
    }
}