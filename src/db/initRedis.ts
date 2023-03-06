/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict';

import Redis from 'ioredis';
import { ValidationError } from '../utils/errors';

class RedisSingleton {
    private static instance: Redis

    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor(config: Object) {
        if (!RedisSingleton.instance) {
            RedisSingleton.instance = new Redis(config);
        }
    }

    getInstance() {
        return RedisSingleton.instance;
    }
}

export let redis: any;

export async function initRedis(){
    const config = {
        host: String(process.env.REDIS_HOST),
        port: Number(process.env.REDIS_PORT),
        username: String(process.env.REDIS_USER),
        password: String(process.env.REDIS_PASSWORD),
        db: Number(process.env.REDIS_DATABASES)
    };    

    redis = new RedisSingleton(config).getInstance();
    try {
        await redis.auth(config.username, config.password);
        console.log("Redis connection successfully established!");

    } catch (err: any) {
        console.error(err);
        throw new ValidationError(err.message);
    }
}