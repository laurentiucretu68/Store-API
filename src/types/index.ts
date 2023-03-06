'use strict';

import { ObjectId } from "mongodb";

/** USER TYPES**/

export interface Client {
    _id?: ObjectId,
    name: string,
    email: string
    password: string
    phoneNumber: string
    address: string
}

export interface ClientUpdate {
    name?: string,
    email?: string
    password?: string
    phoneNumber?: string
    address?: string
}

export interface Admin {
    email: string
    password: string
}


/** PRODUCT TYPES **/
export interface Product {
    _id?: ObjectId
    type: string
    name: string
    price: number
    description: string
    size: string
    quantity: number

    material?: string
    color?: string
    remoteControl?: boolean

    minAge?: number
    maxAge?: number
    haxMaxAge?: boolean
}

export interface ProductUpdate {
    type?: string
    name?: string
    price?: number
    description?: string
    size?: string
    quantity?: number

    material?: string
    color?: string
    remoteControl?: boolean

    minAge?: number
    maxAge?: number
    haxMaxAge?: boolean
}

/** TOKEN TYPE **/
export interface Token {
    _id?: ObjectId,
    userEmail: string
    token: string
}