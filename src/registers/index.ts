'use strict';

import "@fastify/jwt"
import { Admin } from "../types";
import cookie from '@fastify/cookie';
import { Transporter } from 'nodemailer';
import { FastifyInstance } from 'fastify';
import type { FastifyCookieOptions } from '@fastify/cookie';
import { userRouter, productRouter } from '../routes';

export interface FastifyMailerNamedInstance {
    [namespace: string]: Transporter;
}
export type FastifyMailer = FastifyMailerNamedInstance & Transporter;

declare module "fastify" {
    interface FastifyInstance {
        mailer: FastifyMailer;
        auth: (options: unknown) => (request: FastifyRequest, reply: unknown, done: unknown) => void;
    }
}

declare module 'fastify' {
    interface FastifyRequest {
        admin: Admin;
    }
}

export async function fastifyRegister(fastify: FastifyInstance){
    // Documentation
    await fastify.register(require('@fastify/swagger'))
    await fastify.register(require('@fastify/swagger-ui'), {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false,
        },
        staticCSP: true,
        transformStaticCSP: (header: any) => header,
        transformSpecification: (swaggerObject: any, request: any, reply: any) => { return swaggerObject },
        transformSpecificationClone: true
    })

    // AUTH
    fastify.register(require('@fastify/jwt'), {
        secret: process.env.TOKEN_AUTH,
        signOptions: {
            expiresIn: '300m'
        }
    });
    fastify.register(require('@fastify/auth'));

    // Mailer
    fastify.register(require('fastify-mailer'), {
        defaults: {
            from: process.env.MAIL_SENDER
        },
        transport: {
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_TOKEN
            }
        }
    });

    // Routes
    fastify.register(userRouter, { prefix: '/api/user' });
    fastify.register(productRouter, { prefix: '/api/product' });

    // Cookies
    fastify.register(cookie, {
        secret: process.env.COOKIE_SECRET,
        hook: 'onRequest',
        parseOptions: {}
    } as FastifyCookieOptions);
}