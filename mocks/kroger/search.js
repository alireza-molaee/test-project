const products = require('./products.json');
function api(data) {
    const secretKey = data.headers['authorization'];
    if (secretKey !== "12345") {
        return {
            "statusCode": 401,
            "body": {
              "error": "Unauthorized"
            },
        }          
    }

    const term = data.query.term;
    return products.filter(p => p.title.toLowerCase().search(term) !== -1)
}

module.exports = api;