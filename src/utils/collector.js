import { redisClient } from '../models/index';
import axios from 'axios';
import cron from 'node-cron';
import { HttpError } from './error'

const InstaCartBaseUrl = "http://localhost:3000/insta-cart";
const KrogerBaseUrl = "http://localhost:3000/kroger";
const AmazonBaseUrl = "http://localhost:3000/amazon";

function getAccessTokenOfInstaCart() {
    const data = {
        username: 'asd',
        pass: '123'
    }
    return axios.post(`${InstaCartBaseUrl}/get-token`, data).then(res => {
        const accessToken = res.data.token;
        redisClient.set("insta-cart-access-token", accessToken);
    })
}

function getAccessTokenOfKroger() {
    const data = {
        username: 'asd',
        pass: '123'
    }
    return axios.post(`${KrogerBaseUrl}/get-token`, data).then(res => {
        const accessToken = res.data.token;
        redisClient.set("kroger-access-token", accessToken);
    })
}

export function init() {
    const firstResult = Promise.all([
        getAccessTokenOfInstaCart(),
        getAccessTokenOfKroger()
    ])
    cron.schedule('*/25 * * * *', () => {
        getAccessTokenOfInstaCart(),
        getAccessTokenOfKroger()
    });
    return firstResult;
}

export function getAllProducts() {
    return Promise.all([
        axios.get(`${AmazonBaseUrl}/products`),
        axios.get(`${KrogerBaseUrl}/products`),
        axios.get(`${InstaCartBaseUrl}/products`)
    ]).then(([amazonReq, krogerReq, instaCartReq]) => {
        const amazonProducts = amazonReq.data.map(p => ({...p, provider: 'amazon', _id: "a"+p.id}));
        const krogerProducts = krogerReq.data.map(p => ({...p, provider: 'kroger', _id: 'k'+p.id}));
        const instaCartProducts = instaCartReq.data.map(p => ({...p, provider: 'insta-cart', _id: 'i'+p.id}));
        return [...amazonProducts, ...krogerProducts, ...instaCartProducts]
    })
}

export function searchInProducts(term) {
    return Promise.all([
        redisClient.get('kroger-access-token'),
        redisClient.get('insta-cart-access-token')
    ]).then(([krogerAccessToken, instaAccessToken]) => {
        return Promise.all([
            axios.get(`${AmazonBaseUrl}/search`, {
                params: {
                    term,
                    "secret-key": process.env.AMAZON_SECRET_KEY
                }
            }),
            axios.get(`${KrogerBaseUrl}/search`, {
                params: {
                    term
                },
                headers: {
                    Authorization: krogerAccessToken
                }
            }),
            axios.get(`${InstaCartBaseUrl}/search`, {
                params: {
                    term
                },
                headers: {
                    Authorization: instaAccessToken
                }
            })
        ])
    }).then(([amazonReq, krogerReq, instaCartReq]) => {
        const amazonProducts = amazonReq.data.map(p => ({...p, provider: 'amazon', _id: "a"+p.id}));
        const krogerProducts = krogerReq.data.map(p => ({...p, provider: 'kroger', _id: 'k'+p.id}));
        const instaCartProducts = instaCartReq.data.map(p => ({...p, provider: 'insta-cart', _id: 'i'+p.id}));
        return [...amazonProducts, ...krogerProducts, ...instaCartProducts]
    })
}

export function getProductsOfProvider(provider) {
    let requestPromise = null;
    let idPrefix = ""
    switch (provider) {
        case 'amazon':
            requestPromise = axios.get(`${AmazonBaseUrl}/products`);
            idPrefix = "a"
            break;
        case 'kroger':
            requestPromise =  axios.get(`${KrogerBaseUrl}/products`);
            idPrefix = "k"
            break;
        case 'insta-cart':
            requestPromise =  axios.get(`${InstaCartBaseUrl}/products`);
            idPrefix = "i"
            break;
        default:
            throw new HttpError('wrong provider', 400);
    }
    return requestPromise.then(res => {
        return res.data.map(p => ({...p, provider, _id: idPrefix+p.id}))
    })
}