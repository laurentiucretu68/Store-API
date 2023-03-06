import {FastifyReply, FastifyRequest} from "fastify";
import {dbName, mongoClient} from "../../db/initMongo";
import {DataBaseError} from "../../utils/errors";

export async function getAllClients(req: FastifyRequest, res: FastifyReply){
    try {
        const response = await mongoClient.db(dbName).collection('clients').find().toArray();
        if (response){
            res.send(response);
        }
    } catch (err){
        res.send(new DataBaseError('Database operation failed!').toJSON());
    }
    return res
}