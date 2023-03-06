import {FastifyReply, FastifyRequest} from "fastify";
import {dbName, mongoClient} from "../../db/initMongo";
import {DataBaseError, ProcessingError} from "../../utils/errors";

export async function getClientIdByEmail(req: FastifyRequest<{ Params: { email: string }}>, res: FastifyReply){
    const { email } = req.params;
    try {
        const response = await mongoClient.db(dbName).collection('clients').findOne({ email: email });
        if (response){
            res.send({
                _id: String(response._id_)
            });
        } else {
            res.send(new ProcessingError(`User with id ${email} doesn't exist`).toJSON());
        }
    } catch (err){
        res.send(new DataBaseError('Database operation failed!').toJSON());
    }
    return res
}