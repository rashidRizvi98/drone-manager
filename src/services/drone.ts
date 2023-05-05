import { setTimeout } from "timers/promises";
import { Drone } from "../database/models/drone"
import { DroneStateEnum } from "../models/drone";
import { Load } from "../database/models/load";


export const deliverLoad = async (drone: Drone)=> {
    await setTimeout(15000);
    await Drone.update({ state: DroneStateEnum.DELIVERED,battery: drone.battery - 20},{ where: {id: drone.id }});
    await Load.destroy({ where:{droneId: drone.id}});
    await Drone.update({ state: DroneStateEnum.RETURNING},{where: {id: drone.id }});
    await setTimeout(15000);
    const returnedDrone = await Drone.findByPk(drone.id);
    await Drone.update({state: DroneStateEnum.IDLE,battery: returnedDrone?.battery! - 20},{where: {id: drone.id }});
    
}

export const loadDrone = async ( droneId: string) => {
    await Drone.update({ state: DroneStateEnum.LOADING },{ where:{ id: droneId }});
    await setTimeout(15000);
    await Drone.update({ state: DroneStateEnum.LOADED },{ where:{ id: droneId }});
}