import * as cron from 'node-cron';
import { Drone } from '../database/models/drone';
import { getLogger } from './logger';

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
});
}