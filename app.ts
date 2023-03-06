import 'dotenv/config';
import Fastify, { FastifyInstance } from 'fastify';
import { connectToDataBase } from "./src/db/initMongo";
import { amqpConnect, log } from "./src/utils/amqp";
import { initRedis } from "./src/db/initRedis";
import { ServerError } from "./src/utils/errors";
import { fastifyRegister } from './src/registers'

(async () => {
    const fastify: FastifyInstance = Fastify({
        logger: true
    });

    try {
        await connectToDataBase();
        await amqpConnect();
        await initRedis();
        await fastifyRegister(fastify);

        await fastify.listen({
            port: Number(process.env.PORT),
            host: process.env.HOST
        });
        console.log('Server started on port ' + process.env.PORT);

    } catch (err){        
        await log.publish(Buffer.from(JSON.stringify(new ServerError('Error on starting server'))));

        console.error(err);
        process.exit(1);
    }
})();