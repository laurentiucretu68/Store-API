import { FastifyReply, FastifyRequest } from "fastify";
import { dbName, mongoClient } from "../../db/initMongo";
import { DataBaseError, ProcessingError } from "../../utils/errors";

export async function deleteProduct(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply){
    const { id } = req.params
    try {
        const response = await mongoClient.db(dbName).collection('products').deleteOne({ _id: id });
        if (response){
            res.send({ success: true });
        } else {
            res.send(new ProcessingError('Error deleting product').toJSON());
        }
    } catch (err){
        res.send(new DataBaseError('Database operation failed!').toJSON());
    }
    return res
}