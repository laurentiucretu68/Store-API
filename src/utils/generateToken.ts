'use strict';

import { TokenGenerator, TokenBase } from 'ts-token-generator';
import crypto from "crypto";
 
export const token = new TokenGenerator({ 
    bitSize: 512, 
    baseEncoding: TokenBase.BASE62 
}).generate() as string;

export const encryptPassword = (password: string) => {
    return crypto.createHash('sha256').update(password).digest("hex")
};