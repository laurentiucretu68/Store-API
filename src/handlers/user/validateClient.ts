import {FastifyReply, FastifyRequest} from "fastify";
import {dbName, mongoClient} from "../../db/initMongo";
import util from "util";
import {redis} from "../../db/initRedis";
import {Client} from "../../types";
import {DataBaseError, ProcessingError} from "../../utils/errors";

export async function validateAccount(req: FastifyRequest<{ Params: { userEmail: string, token: string } }>, res: FastifyReply){
    const { userEmail, token } = req.params;
    try {
        const checkToken = await mongoClient.db(dbName).collection('tokens').findOne({ token: token });
        const checkUserId = await mongoClient.db(dbName).collection('clients').findOne({ email: userEmail });

        if (checkToken && !checkUserId) {
            const getClientData = util.promisify(redis.get).bind(redis);

            const newClient = JSON.parse(String(await getClientData(userEmail))) as Client;
            const response = await mongoClient.db(dbName).collection('clients').insertOne(newClient);

            const deleteToken = await mongoClient.db(dbName).collection('tokens').deleteOne({ token: token });
            const deleteSession = await redis.del([userEmail]);

            if (response && deleteToken && deleteSession) {
                res.send({ success: true });
            } else{
                res.send(new DataBaseError('Error on database insertion').toJSON());
            }
        } else {
            res.send(new ProcessingError('Error on finding Token or existent user').toJSON());
        }

    } catch (error){
        res.send(new DataBaseError('Error on database connection').toJSON());
    }
    return res;
}

