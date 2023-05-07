import { Sequelize } from "sequelize-typescript";
import { Drone } from "./models/drone";
import { dbConfig } from "../config";
import { createdb } from "pgtools";
import { Medication } from "./models/medication";
import { Load } from "./models/load";
import { initializeDefaultData } from "../helpers/initial-data";
import { batteryLevelCron } from "../helpers/battery-level.cron";
import { BatteryLevelLog } from "./models/battery-level-log";
import { getLogger } from "../helpers/logger";

const logger = getLogger('DATABASE');

export const connection = new Sequelize({
    username: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: "postgres",
    database: "drone-manager",
    logging: false,
    models: [Drone,Medication,Load,BatteryLevelLog]
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
        logger.info("SYNCED DRONE MANAGER DB SUCCESSFULLY");  
        try {
            await initializeDefaultData();
            batteryLevelCron();
            logger.info("SUCCESSFULLY INITIALIZED DEFAULT DATA");
        } catch (error) {
            logger.error("FAILED TO INITIALIZE DEFAULT DATA: ",error);
        }     
    } catch (error) {
        logger.error("FAILED TO ESTABLISH DB CONNECTION: ",error);
    }


}