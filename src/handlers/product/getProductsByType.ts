import { FastifyReply, FastifyRequest } from "fastify";
import { dbName, mongoClient } from "../../db/initMongo";
import { DataBaseError, ProcessingError } from "../../utils/errors";

export async function getProductById(req: FastifyRequest<{ Params: { type: string }}>, res: FastifyReply){
    const { type } = req.params;
    try {
        const checkType = await mongoClient.db(dbName).collection('productTypes').findOne({ name: type })
        if (!checkType) {
            res.send(new ProcessingError(`Invalid product type`).toJSON());
            return res
        }

        const response = await mongoClient.db(dbName).collection('products').find({ type: type }).toArray();
        if (response){
            res.send(response);
        } else {
            res.send(new ProcessingError(`No product with type ${type} found`).toJSON());
        }
    } catch (err){
        res.send(new DataBaseError('Database operation failed!').toJSON());
    }
    return res
}