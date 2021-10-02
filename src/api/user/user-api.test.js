import mock from 'mock-require';
import {User} from '../../models';
import Redis from "ioredis-mock";
import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MockMongoose } from 'mock-mongoose';
const mockMongoose = new MockMongoose(mongoose);

describe('user api', function() {
    let redisClient;
    let a;

    this.timeout(5000)

    before((done) => {
        mockMongoose.prepareStorage().then(function() {
            redisClient = new Redis();
            const connectDb = () => {
                return mongoose.connect(process.env.DATABASE_URL);
            };        
            mock('../../models', {connectDb, User, redisClient})
            a = require('../../app').app;
            connectDb().then(() => {
                a.listen(3002, function(err) {
                  if (err) { return done(err); }
                  done();
                });
            })
        })
    });
    

    it('should understand verify when body data is correct', function(done) {
        const secretCode = "12345"
        const userId = "asd123"
        const creatAt = new Date().valueOf();
        const cacheUser = {
            phoneNumber: "09121111111",
            name: "foo",
            family: "bar",
            secretCode,
            creatAt
        };
        redisClient.hmset(`user:${userId}`, cacheUser).then(() => {
            request(a)
            .post('/api/user/verification')
            .set('Content-Type', 'application/json')
            .send({
                userId,
                secretCode
            })
            .expect('Content-Type', /json/)
            .expect(200, function(err, res) {
                if (err) { return done(err); }
                done();
              });
        });
    });
  
});