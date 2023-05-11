import { setTimeout } from "timers/promises";
import { Drone } from "../database/models/drone"
import { DroneStateEnum, IDrone } from "../models/drone";
import { Load } from "../database/models/load";
import { getDroneWeightLimit } from "../helpers/helper";
import { connection } from "../database";
import { getLogger } from "../helpers/logger";
import { Medication } from "../database/models/medication";
import { IMedication } from "../models/medication";
import { getPreSignedUrl } from "../middlewares/file-upload";
import { Op } from "sequelize";
import { HttpError } from "../helpers/custom-error";

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
        await drone.update({state: DroneStateEnum.DELIVERING})
        await setTimeout(drone.distanceToDestination * 2000);
        await Drone.update({ state: DroneStateEnum.DELIVERED,batteryPercentage: drone.batteryPercentage - (drone.distanceToDestination *4)},{ where: {id: drone.id }});
        await Load.destroy({ where:{ serialNumber: drone.serialNumber }});
        await setTimeout(5000);
        await Drone.update({ state: DroneStateEnum.RETURNING},{ where: {id: drone.id }});
        await setTimeout(drone.distanceToDestination * 2000);
        const returnedDrone = await Drone.findByPk(drone.serialNumber);
        await Drone.update({state: DroneStateEnum.IDLE,batteryPercentage: returnedDrone?.batteryPercentage! - (drone.distanceToDestination *4)},{where: {id: drone.id }});
   } catch (error) {
        logger.error(error);
        throw error;
   }    
}

const loadDrone = async ( droneId: string) => {
    try {
            await Drone.update({ state: DroneStateEnum.LOADING },{ where:{ id: droneId }});
            await setTimeout(5000);
            await Drone.update({ state: DroneStateEnum.LOADED },{ where:{ id: droneId }});
        
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const resetDrone = async ( serialNumber: string) => {

    const drone = await Drone.findOne({where: { serialNumber }});

    if (!drone) {
        throw new HttpError(404,"Invalid serial number");   
    }
    try {
            await Drone.update({ state: DroneStateEnum.IDLE, batteryPercentage: 100 },{ where:{ serialNumber }});
            await Load.destroy({ where:{ serialNumber }});
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const rechargeDrone = async (serialNumber: string) => {
    const drone = await Drone.findOne({where: { serialNumber }});

    if (!drone) {
        throw new Error("Invalid serial number");   
    }
    try {
        await drone.update({batteryPercentage: 100},{where:{ serialNumber }});          
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getBatteryPercentage = async (serialNumber: string) => {
    const drone = await Drone.findOne({where: { serialNumber }});

    if (!drone) {
        throw new HttpError(404,"Invalid serial number");   
    }
    return drone.batteryPercentage;
}

const getLoadedMedicationsInDrone = async (serialNumber: string) => {
    const drone = await Drone.findOne({
        where: { serialNumber },
        include: Load        
    });
    if (!drone) {
        throw new Error("Invalid serial number");   
    }
    const medicationCodes = drone?.loads.map(load => load.code);

    const medicationList = await Medication.findAll({ raw: true, where: { code: medicationCodes }});
    let medicationsWithSignedUrl: IMedication[] = [];
    await Promise.all(medicationList.map(async(medication) =>{
        medicationsWithSignedUrl.push({
            ...medication,
            image: await getPreSignedUrl(medication.image)
        });
    }));
    let responsePayload: any[] = [];
    drone.loads.forEach(load => {
        const match = medicationsWithSignedUrl.find(medication => load.code == medication.code);

        responsePayload.push({...match,count: load.count});
    });
    return responsePayload;
}

const getDronesAvailableForLoading = async () => {
    const drones = await Drone.findAll({
        include: Load,
        where: { state: { [Op.in] : [DroneStateEnum.IDLE,DroneStateEnum.LOADED]},
        batteryPercentage: { [Op.gte]: 25 }}});

    let dronesWithSpace = [];
    for (const drone of drones) {
        let weightInDrone = 0
        await Promise.all(drone.loads.map(async( load) =>{
            const med = await Medication.findOne({where: { code: load.code }});
            weightInDrone += (med?.weight! * load.count);
            
        }));

        if (weightInDrone != drone.weightLimit) {
                dronesWithSpace.push(drone);
        }            
    }
    return dronesWithSpace;
}

export default { registerDrone,
                 findAllDrones,
                 deliverLoad,
                 loadDrone,
                 resetDrone,
                 rechargeDrone,
                 getBatteryPercentage,
                 getLoadedMedicationsInDrone,
                 getDronesAvailableForLoading    
                }