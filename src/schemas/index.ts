'use strict'

import { Type } from '@sinclair/typebox';

// Client schema
export const clientSchema = Type.Object({
    _id: Type.Optional(Type.String()),
    name: Type.String(),
    email: Type.String({ format: 'email' }),
    password: Type.String(),
    phoneNumber: Type.String(),
    address: Type.Optional(Type.String())
});

export const clientUpdateSchema = Type.Object({
    name: Type.Optional(Type.String()),
    email: Type.Optional(Type.String({ format: 'email' })),
    password: Type.Optional(Type.String()),
    phoneNumber: Type.Optional(Type.String()),
    address: Type.Optional(Type.String())
});

export const loginClientSchema = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String()
});

/* Product schemas*/
export const productSchema = Type.Object({
    _id: Type.Optional(Type.String()),
    type: Type.String(),
    name: Type.String(),
    price: Type.Number(),
    description: Type.String(),
    size: Type.String(),
    quantity: Type.Number(),
    material: Type.Optional(Type.String()),
    color: Type.Optional(Type.String()),
    remoteControl: Type.Optional(Type.Boolean()),
    minAge: Type.Optional(Type.Number({ minimum: 0 })),
    maxAge: Type.Optional(Type.Number({ maximum: 18 })),
    haxMaxAge: Type.Optional(Type.Boolean()),
});

export const productUpdateSchema = Type.Object({
    type: Type.Optional(Type.String()),
    name: Type.Optional(Type.String()),
    price: Type.Optional(Type.Number()),
    description: Type.Optional(Type.String()),
    size: Type.Optional(Type.String()),
    quantity: Type.Optional(Type.Number()),
    material: Type.Optional(Type.String()),
    color: Type.Optional(Type.String()),
    remoteControl: Type.Optional(Type.Boolean()),
    minAge: Type.Optional(Type.Number({ minimum: 0 })),
    maxAge: Type.Optional(Type.Number({ maximum: 18 })),
    haxMaxAge: Type.Optional(Type.Boolean()),
});
