import * as cron from 'node-cron';
import { Drone } from '../database/models/drone';
import { getLogger } from './logger';
import { BatteryLevelLog } from '../database/models/battery-level-log';

const logger = getLogger('BATTERY LEVEL CRON');

export const batteryLevelCron = () => {
   
cron.schedule('* * * * *', async() => {
    const droneList = await Drone.findAll();
    for (const drone of droneList) {
        const batteryLevelLog = `Battery level of ${drone.serialNumber} is ${drone.batteryPercentage}%`;
        if (drone.batteryPercentage < 25) {
            logger.warn(batteryLevelLog);
        }else{
            logger.info(batteryLevelLog);
        }
    }
    const batteryLevelLogs = droneList.map(drone => ({
        serialNumber: drone.serialNumber, 
        batteryPercentage: drone.batteryPercentage}));
        try {
            await BatteryLevelLog.bulkCreate(batteryLevelLogs); 
            logger.info("Inserted logs into db");           
        } catch (error) {
            logger.error('Failed to insert the logs in db');
        }

});
}