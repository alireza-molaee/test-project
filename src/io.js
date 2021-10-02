import {verifyJWTToken} from './utils/auth';
import event from './utils/event'
import { User } from './models';

const families = {}

export default (io) => {
    io.on('connection', (socket) => {
        socket.on("update-product", (token) => {
            verifyJWTToken(token).then((decodedToken) => {
                User.findById(decodedToken.data.id).then((user) => {
                    if (user) {
                        const family = user.family || 'all'
                        if (families[family] === undefined) {
                            families[family] = []
                        }
                        families[family] = [...families[family], socket]
                    }
                })
            })
        })
    });

    event.on('update-product', (data, product) => {
        User.findById(data.id).then((user) => {
            const sockets = families[user.family || 'all'];
            if (sockets && Array.isArray(sockets)) {
                sockets.forEach(s => s.emit("update-product", product))
            }
        })
    });
}