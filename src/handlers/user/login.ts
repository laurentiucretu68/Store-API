import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {dbName, mongoClient} from "../../db/initMongo";
import {encryptPassword} from "../../utils/generateToken";
import {Admin} from "../../types";
import {redis} from "../../db/initRedis";
import {DataBaseError, ProcessingError} from "../../utils/errors";

export async function login(this: FastifyInstance, req: FastifyRequest<{ Body: { email: string, password: string } }>, res: FastifyReply){
    const { email, password } = req.body;
    try {
        const user = await mongoClient.db(dbName).collection('admins')
            .findOne({ email: email, password: encryptPassword(password) });
        if (user) {
            const admin: Admin = user as unknown as Admin;
            const tokenJWT = this.jwt.sign(admin)

            await redis.select(1) // redis database for login sessions
            const response = await redis.set(email, tokenJWT, 'EX', 300 * 60);

            if (response) {
                res.send({ tokenJWT });
            } else {
                res.send(new ProcessingError('Login failed').toJSON());
            }
        } else {
            res.send(new ProcessingError('User not found').toJSON());
        }
    } catch (error){
        res.send(new DataBaseError('Error on database connection').toJSON());
    }
    return res;
}

