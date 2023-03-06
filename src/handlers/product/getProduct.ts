import { FastifyReply, FastifyRequest } from "fastify";
import { dbName, mongoClient } from "../../db/initMongo";
import { ObjectId } from "mongodb";
import { DataBaseError, ProcessingError } from "../../utils/errors";

export async function getProduct(req: FastifyRequest<{ Params: { id: string }}>, res: FastifyReply){
    const { id } = req.params;
    try {
        const response = await mongoClient.db(dbName).collection('products').findOne({ _id: new ObjectId(id) });
        if (response){
            res.send(response);
        } else {
            res.send(new ProcessingError(`Product with id ${id} doesn't exist`).toJSON());
        }
    } catch (err){
        res.send(new DataBaseError('Database operation failed!').toJSON());
    }
    return res
}