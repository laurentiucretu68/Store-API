import {FastifyReply, FastifyRequest} from "fastify";
import { Product } from "../../types";
import {dbName, mongoClient} from "../../db/initMongo";
import {DataBaseError, ProcessingError} from "../../utils/errors";

export async function addProduct(req: FastifyRequest<{ Body: Product }>, res: FastifyReply){
    const product: Product = req.body;
    try {
        const checkValidType = await mongoClient.db(dbName).collection('productTypes').findOne({ name: product.type })
        if (!checkValidType) {
            res.send(new ProcessingError('Invalid product type').toJSON());
            return res
        }

        const response = await mongoClient.db(dbName).collection('products').insertOne(product);
        if (response){
            res.send({ success: true });
        } else {
            res.send(new ProcessingError('Error inserting product').toJSON());
        }
    } catch (err){
        res.send(new DataBaseError('Database operation failed!').toJSON());
    }
    return res
}