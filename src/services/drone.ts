import { setTimeout } from "timers/promises";
import { Drone } from "../database/models/drone"
import { DroneStateEnum } from "../models/drone";
import { Load } from "../database/models/load";


export const deliverLoad = async (drone: Drone)=> {
    await setTimeout(10000);
    await Drone.update({ state: DroneStateEnum.DELIVERED,batteryPercentage: drone.batteryPercentage - (drone.distanceToDestination *4)},{ where: {id: drone.id }});
    await Load.destroy({ where:{ serialNumber: drone.serialNumber }});
    await Drone.update({ state: DroneStateEnum.RETURNING},{ where: {id: drone.id }});
    await setTimeout(10000);
    const returnedDrone = await Drone.findByPk(drone.serialNumber);
    await Drone.update({state: DroneStateEnum.IDLE,batteryPercentage: returnedDrone?.batteryPercentage! - (drone.distanceToDestination *4)},{where: {id: drone.id }});
    
}

export const loadDrone = async ( droneId: string) => {
    await Drone.update({ state: DroneStateEnum.LOADING },{ where:{ id: droneId }});
    await setTimeout(5000);
    await Drone.update({ state: DroneStateEnum.LOADED },{ where:{ id: droneId }});
}