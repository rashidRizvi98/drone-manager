import { setTimeout } from "timers/promises";
import { Drone } from "../database/models/drone"
import { DroneStateEnum } from "../models/drone";

export const loadDrone = async ( droneId: string) => {
    await Drone.update({ state: DroneStateEnum.LOADING },{ where:{ id: droneId }});
    await setTimeout(15000);
    await Drone.update({ state: DroneStateEnum.LOADED },{ where:{ id: droneId }});
}