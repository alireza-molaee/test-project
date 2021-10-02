
import { HttpError } from '../../utils/error';
import event from '../../utils/event';
import { getAllProducts as getAllProductsFromSource, searchInProducts, getProductsOfProvider } from '../../utils/collector';


export function getAllProducts(req, res, next) {
    getAllProductsFromSource().then(products => {
        res.status(200).send(products);
    }).catch(err => {
        console.error(err)
        res.status(500).send('something went wrong');
    })
}


export function searchProduct(req, res, nex) {
    if(req.user.role !== 'admin') {
        throw new HttpError(`you don't have credit`, 403);
    }
    if (req.params.term.length > 100) {
        throw new HttpError(`the term is too long`, 400);
    }
    searchInProducts(req.params.term).then(products => {
        res.status(200).send(products);
    }).catch(err => {
        console.error(err)
        res.status(500).send('something went wrong');
    })
}

export function productsForProvider(req, res, nex) {
    getProductsOfProvider(req.params.provider).then(products => {
        res.status(200).send(products);
    }).catch(err => {
        console.error(err)
        res.status(500).send('something went wrong');
    })
}

export function updateProduct(req, res, next) {
    event.emit('update-product', req.user, req.body)
    res.status(200).send('updated successfully')
}