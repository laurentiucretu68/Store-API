'use strict';

import {MongoClient} from "mongodb";

export const mongoClient: MongoClient = new MongoClient(String(process.env.MONGO_URI));
export const dbName = String(process.env.MONGO_DB);

export async function connectToDataBase(){
    await mongoClient.connect();
    console.log("Database connection successfully established!");
}

export async function disconnect(){
    await mongoClient.close();
    console.log("Database connection closed!");
}