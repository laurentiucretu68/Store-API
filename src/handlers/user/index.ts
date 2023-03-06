'use strict'

import { redis } from "../../db/initRedis";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticationError, DataBaseError, ProcessingError } from "../../utils/errors";

export async function restrictTo(req: FastifyRequest, res: FastifyReply) {
    const user = req.user;
    if (user) {
        return { user };
    }
    throw new AuthenticationError('Restricted access').toJSON()
}

export async function getSession(req: FastifyRequest<{ Params: { email: string }}>, res: FastifyReply) {
    const { email } = req.params
    try {
        const response = await redis.get(email);
        if (response) {
            res.send({ jwt: response })
        } else {
            res.send(new ProcessingError(`No session found`).toJSON());
        }
    } catch (error) {
        res.send(new DataBaseError('Error on redis connection').toJSON());
    }
    return res
}