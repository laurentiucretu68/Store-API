'use strict'

import { Type } from '@sinclair/typebox';
import { FastifyInstance } from "fastify";
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

// User handlers
import { registerClient } from '../handlers/user/registerClient'
import { login } from '../handlers/user/login'
import { validateAccount } from '../handlers/user/validateClient'
import { deleteClient } from '../handlers/user/deleteClient'
import { updateClient } from '../handlers/user/updateClient'
import { getClientIdByEmail } from "../handlers/user/getClientId";
import { getAllClients } from "../handlers/user/getAllClients";
import { restrictTo, getSession } from '../handlers/user';
import { adminAuth } from '../preHandlers/adminAuth'
import { jwtAuthentication } from '../preHandlers/jwtAuthentication'
import { clientSchema, clientUpdateSchema, loginClientSchema } from '../schemas'

// Product handlers
import { addProduct } from "../handlers/product/addProduct";
import { getProduct } from "../handlers/product/getProduct";
import { updateProduct } from "../handlers/product/updateProduct";
import { deleteProduct } from "../handlers/product/deleteProduct";
import { getProductById } from "../handlers/product/getProductsByType";
import { productSchema, productUpdateSchema } from "../schemas";


export async function userRouter(fastify: FastifyInstance) {
    fastify.withTypeProvider<TypeBoxTypeProvider>();

    fastify.route({
        method: 'GET',
        url: '/restrict',
        preHandler: jwtAuthentication,
        handler: restrictTo,
    })

    // Client register
    fastify.route({
        method: 'POST',
        url: '/register',
        schema: {
            body: clientSchema
        },
        handler: registerClient,
    })

    // Client validate account
    fastify.route({
        method: 'POST',
        url: '/validate-account/:userEmail/:token',
        schema: {
            params: Type.Object({
                userEmail: Type.String({ format: 'email' }),
                token: Type.String()
            })
        },
        handler: validateAccount,
    })

    // Client login
    fastify.route({
        method: 'POST',
        url: '/login',
        schema: {
            body: loginClientSchema
        },
        handler: login,
    })

    // Get client id by email
    fastify.route({
        method: 'GET',
        url: '/get-id/:email',
        schema: {
            params: Type.Object({
                email: Type.String({ format: 'email' })
            })
        },
        handler: getClientIdByEmail,
    })

    // Get all clients
    fastify.route({
        method: 'GET',
        url: '/get-clients',
        handler: getAllClients,
    })

    // Delete client account
    fastify.route({
        method: 'DELETE',
        url: '/delete/:id',
        preHandler: jwtAuthentication,
        schema: {
            params: Type.Object({
                id: Type.String({ minLength: 24 })
            })
        },
        handler: deleteClient,
    })

    // Update client account information
    fastify.route({
        method: 'PUT',
        url: '/update/:id',
        preHandler: jwtAuthentication,
        schema: {
            body: clientUpdateSchema
        },
        handler: updateClient,
    })

    // Get JWT session from Redis
    fastify.route({
        method: 'GET',
        url: '/session/:email',
        schema: {
            params: Type.Object({
                email: Type.String()
            })
        },
        handler: getSession,
    })
}

export async function productRouter(fastify: FastifyInstance){
    fastify.withTypeProvider<TypeBoxTypeProvider>();

    // Add product
    fastify.route({
        method: 'POST',
        url: '/add',
        preHandler: adminAuth,
        schema: {
            body: productSchema
        },
        handler: addProduct,
    })

    // Get product by id
    fastify.route({
        method: 'GET',
        url: '/get/:id',
        schema: {
            params: Type.Object({
                id: Type.String({ minLength: 24 })
            })
        },
        handler: getProduct,
    })

    // Get products by type
    fastify.route({
        method: 'GET',
        url: '/type/get/:type',
        schema: {
            params: Type.Object({
                type: Type.String({ minLength: 24 })
            })
        },
        handler: getProductById,
    })

    // Update product
    fastify.route({
        method: 'PUT',
        url: '/update/:id',
        preHandler: adminAuth,
        schema: {
            body: productUpdateSchema
        },
        handler: updateProduct,
    })

    // Delete product
    fastify.route({
        method: 'DELETE',
        url: '/delete/:id',
        preHandler: adminAuth,
        schema: {
            params: Type.Object({
                id: Type.String({ minLength: 24 })
            })
        },
        handler: deleteProduct,
    })
}