import mongoose from 'mongoose';
import Redis from 'ioredis';

import User from './user';

const redisClient = new Redis();

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL);
};

export { connectDb, redisClient, User};