import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import api from './api';
import errorHandler, { handleValidationError } from './middlewares/error-handling';
import fileUpload from 'express-fileupload';
import http from 'http';
import { Server } from 'socket.io';
import ioFunc from './io';
import view from './view';

export const app = express();
app.use(bodyParser.json());
app.use(morgan(process.env.MORGAN_LOG));
app.use(fileUpload({
    fileSize: 50 * 1024 * 1024,
    abortOnLimit: true,
    createParentPath: true,
}))
// app.use(handleValidationError);
app.use('/static', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/api', api);
app.use('/', view);
app.use(errorHandler);
const server = http.createServer(app);
const io = new Server(server);
ioFunc(io);
export default server;

