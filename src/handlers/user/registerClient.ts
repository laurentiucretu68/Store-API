import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Client, Token} from "../../types";
import {encryptPassword, token} from "../../utils/generateToken";
import {dbName, mongoClient} from "../../db/initMongo";
import {ObjectId} from "mongodb";
import {redis} from "../../db/initRedis";
import {accountsQueue} from "../../utils/amqp";
import {DataBaseError, ProcessingError} from "../../utils/errors";

export async function registerClient(this: FastifyInstance, req: FastifyRequest<{ Body: Client }>, res: FastifyReply ){
    const newClient: Client = req.body;
    newClient.password = encryptPassword(newClient.password);

    try {
        const checkDuplicateClient = await mongoClient.db(dbName).collection('clients').findOne({
            $or: [{ email: newClient.email}, { phoneNumber: newClient.phoneNumber}] });

        if (!checkDuplicateClient){
            newClient._id = new ObjectId();

            const checkDuplicateToken = await mongoClient.db(dbName).collection('tokens')
                .findOne({ userEmail: newClient.email});
            if (!checkDuplicateToken){
                const clientToken: Token = {
                    userEmail: newClient.email,
                    token: token
                };
                const saveToken = await mongoClient.db(dbName).collection('tokens').insertOne({
                    "createdAt": new Date(),
                    token: clientToken.token,
                    userEmail: clientToken.userEmail
                });

                const response = await redis.set(String(newClient.email), JSON.stringify(newClient), 'EX', 600);

                const message: unknown = {
                    client: newClient,
                    token: token
                };
                await accountsQueue.publish(Buffer.from(JSON.stringify(message)));

                response && saveToken ?
                    res.send({ success: true })
                    : res.send(new DataBaseError('Error on database insertion').toJSON());
            } else {
                res.send(new ProcessingError('E-mail already send!'));
            }

        } else {
            res.send(new ProcessingError('User already exist').toJSON());
        }
    } catch (error){
        res.send(new DataBaseError('Error on database connection').toJSON());
    }
    return res;
}

