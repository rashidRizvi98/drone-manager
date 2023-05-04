import { Sequelize } from "sequelize-typescript";
import { Drone } from "./models/drone";
import { dbConfig } from "../config";
import { createdb } from "pgtools";
import { Medication } from "./models/medication";

const connection = new Sequelize({
    username: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: "postgres",
    database: "drone-manager",
    logging: false,
    models: [Drone,Medication]
})

export const createDatabase = async (dbName: string) => {
    await createdb({
        user: dbConfig.username,
        password: dbConfig.password,
        host: dbConfig.host,
        port: dbConfig.port
    }, dbName);
}

export const initializeDatabase =async () => {

    try {
        await createDatabase(dbConfig.name);        
    } catch (error) {
    }

    try {
        await connection.sync({force: false,alter: true});  
        console.log("SYNCED DRONE MANAGER DB SUCCESSFULLY");      
    } catch (error) {
        console.log("FAILED TO ESTABLISH DB CONNECTION: ",error);
    }


}