import {FastifyReply, FastifyRequest} from "fastify";
import {dbName, mongoClient} from "../../db/initMongo";
import {ObjectId} from "mongodb";
import {DataBaseError, ProcessingError} from "../../utils/errors";

export async function deleteClient(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply){
    const { id } = req.params;
    try {
        const checkExistentAccount = await mongoClient.db(dbName).collection('clients')
            .findOne({ _id: new ObjectId(id) });
        if (checkExistentAccount){
            const deleteAccount = await mongoClient.db(dbName).collection('clients')
                .deleteOne({ _id: new ObjectId(id) });
            if (deleteAccount){
                res.send({ success: true });
            } else {
                res.send(new ProcessingError(`Error on deleting account with ${id} _id`).toJSON());
            }
        } else {
            res.send(new ProcessingError(`Error on finding account with ${id} _id`).toJSON());
        }

    } catch (error){
        res.send(new DataBaseError('Error on database connection').toJSON());
    }
    return res;
}

