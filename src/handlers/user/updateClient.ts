import { FastifyReply, FastifyRequest } from "fastify";
import { ClientUpdate } from "../../types";
import { dbName, mongoClient } from "../../db/initMongo";
import { DataBaseError, ProcessingError } from "../../utils/errors";

export async function updateClient(req: FastifyRequest<{ Body: ClientUpdate, Params: { id: string} }>, res: FastifyReply) {
    const client = req.body;
    const { id } = req.params;
    try {
        const result = await mongoClient.db(dbName).collection('clients')
                                                   .updateOne({ _id: id }, { $set: client })
        if (result) {
            res.send({ success: true })
        } else {
            res.send(new ProcessingError('Client doesn\'t exist').toJSON());
        }
    } catch (error) {
        console.log(error)
        res.send(new DataBaseError('Error on database connection').toJSON());
    }
    return res
}
