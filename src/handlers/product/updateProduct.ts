import { FastifyReply, FastifyRequest } from "fastify";
import { ProductUpdate } from "../../types";
import { dbName, mongoClient } from "../../db/initMongo";
import { DataBaseError, ProcessingError } from "../../utils/errors";

export async function updateProduct(req: FastifyRequest<{ Body: ProductUpdate, Params: { id: string } }>, res: FastifyReply){
    const product: ProductUpdate = req.body;
    const { id } = req.params
    try {
        if (product.type) {
            const checkValidType = await mongoClient.db(dbName).collection('productTypes').findOne({ type: product.type })
            if (!checkValidType) {
                res.send(new ProcessingError('Invalid product type').toJSON());
                return res
            }
        }

        const response = await mongoClient.db(dbName).collection('products')
                                                     .updateOne({ _id: id }, { $set: product });
        if (response){
            res.send({ success: true });
        } else {
            res.send(new ProcessingError('Error updating product').toJSON());
        }
    } catch (err){
        res.send(new DataBaseError('Database operation failed!').toJSON());
    }
    return res
}