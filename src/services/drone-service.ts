import { setTimeout } from "timers/promises";
import { Drone } from "../database/models/drone"
import { DroneStateEnum, IDrone } from "../models/drone";
import { Load } from "../database/models/load";
import { getDroneWeightLimit } from "../helpers/helper";
import { connection } from "../database";
import { getLogger } from "../helpers/logger";

const logger = getLogger("DRONE SERVICE")

const registerDrone = async (payload: IDrone)=> {
   return Drone.findOrCreate({
        where: { serialNumber: payload.serialNumber },
        defaults: {
            serialNumber: payload.serialNumber,
            batteryPercentage: payload?.batteryPercentage,
            weightLimit: getDroneWeightLimit(payload?.model),
            model: payload?.model,
            state: payload?.state,
            distanceToDestination: payload.distanceToDestination
        }
    });
}

const findAllDrones = async () => {
    return Drone.findAll();
}

const deliverLoad = async (drone: Drone)=> {
   try {
    await connection.transaction(async ()=> {
        await drone.update({state: DroneStateEnum.DELIVERING})
        await setTimeout(10000);
        await Drone.update({ state: DroneStateEnum.DELIVERED,batteryPercentage: drone.batteryPercentage - (drone.distanceToDestination *4)},{ where: {id: drone.id }});
        await Load.destroy({ where:{ serialNumber: drone.serialNumber }});
        await Drone.update({ state: DroneStateEnum.RETURNING},{ where: {id: drone.id }});
        await setTimeout(10000);
        const returnedDrone = await Drone.findByPk(drone.serialNumber);
        await Drone.update({state: DroneStateEnum.IDLE,batteryPercentage: returnedDrone?.batteryPercentage! - (drone.distanceToDestination *4)},{where: {id: drone.id }});
    });
   } catch (error) {
        logger.error(error);
   }

    
}

const loadDrone = async ( droneId: string) => {
    try {
        await connection.transaction(async()=>{
            await Drone.update({ state: DroneStateEnum.LOADING },{ where:{ id: droneId }});
            await setTimeout(5000);
            await Drone.update({ state: DroneStateEnum.LOADED },{ where:{ id: droneId }});
        
        });
    } catch (error) {
        logger.error(error);
    }
}

export default { registerDrone,
                 findAllDrones,
                 deliverLoad,
                 loadDrone    
                }