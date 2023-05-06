import { RequestHandler } from "express";
import { Drone } from "../database/models/drone";
import { DroneStateEnum, IDrone } from "../models/drone";
import { deliverLoad } from "../services/drone";
import { Load } from "../database/models/load";
import { getDroneWeight } from "../helpers/helper";
import { Medication } from "../database/models/medication";
import { getPreSignedUrl } from "../middlewares/file-upload";
import { IMedication } from "../models/medication";
import { Op } from "sequelize";

export const registerDrone: RequestHandler = async (req,res,next) => {
    const payload : IDrone = req.body;
    try {
        const [registeredDrone ,created] = await Drone.findOrCreate({
            where: { serialNumber: payload.serialNumber },
            defaults: {
                serialNumber: payload.serialNumber,
                batteryPercentage: payload?.batteryPercentage,
                weight:getDroneWeight(payload?.model),
                model: payload?.model,
                state:payload?.state,
                distanceToDestination: payload.distanceToDestination
            }
        });
    
        if (created) {
            return res.status(201)
            .json({message: "Drone Registered Successfully", data: registeredDrone});        
        }else{
            return res.status(200)
            .json({message: "Drone has been alrady registered", data: registeredDrone});
        }        
    } catch (error) {
        return next(error); 
    }

}

export const findAllDrones: RequestHandler = async (req, res, next) => {
    const drones = await Drone.findAll();

    return res.status(200)
    .json({message: "Success",data: drones});
}

export const deliver: RequestHandler = async (req, res, next) => {
    const drone = await Drone.findOne({where: { serialNumber: req.body.serialNumber }});

    if (!drone) {
        return next(new Error("Invalid serial number"));   
    }

    if (drone.state == DroneStateEnum.DELIVERING) {
        return next(new Error("On a delivery, please wait."));        
    }

    if (drone.state == DroneStateEnum.RETURNING) {
        return next(new Error("Returning from delivery, please wait."));        
    }

    if(drone?.state != DroneStateEnum.LOADED)
    return next(new Error("Drone is not Loaded"));

    await drone.update({state: DroneStateEnum.DELIVERING})
    deliverLoad(drone);
    return res.status(200)
    .json({message: "Delivery in progress..."});
}

export const resetDrone: RequestHandler = async (req,res,next) => {
    const {droneId} = req.body
    Drone.update({state: DroneStateEnum.IDLE},{where:{ id: droneId }})
    Load.destroy({where:{ droneId }});
    return res.status(200)
    .json({message: "Successfully Reset"});
}

export const rechargeDrone: RequestHandler = async (req,res,next) => {
    const { serialNumber } = req.body

    const drone = await Drone.findOne({where: { serialNumber }});

    if (!drone) {
        return next(new Error("Invalid serial number"));   
    }

    await drone.update({batteryPercentage: 100},{where:{ serialNumber }})
    return res.status(200)
    .json({message: "Successfully Recharged"});
}

export const checkBatteryPercentage: RequestHandler = async (req,res,next) => {
    const { serialNumber } = req.params
    console.log("checkBatter",serialNumber);
    const drone = await Drone.findOne({where: { serialNumber }});

    if (!drone) {
        return next(new Error("Invalid serial number"));   
    }

    return res.status(200)
    .json({data: `${drone.batteryPercentage}%`});
}

export const getLoadedMedications: RequestHandler = async (req, res, next) => {
    const { serialNumber } = req.params;
    const drone = await Drone.findOne({
        where: { serialNumber },
        include: Load        
    });
    if (!drone) {
        return next(new Error("Invalid serial number"));   
    }
    const medicationIds = drone?.loads.map(load => load.medicationId);

    const medicationList = await Medication.findAll({ raw: true, where: { id: medicationIds }});
    let medicationsWithSignedUrl: IMedication[] = [];
    await Promise.all(medicationList.map(async(medication) =>{
        medicationsWithSignedUrl.push({
            ...medication,
            image: await getPreSignedUrl(medication.image)
        });
    }));
    let responsePayload: any[] = [];
    drone.loads.forEach(load => {
        const match = medicationList.find(medication => load.medicationId == medication.id);

        responsePayload.push({...match,count: load.count});
    });

    return res.status(200)
    .json({data: responsePayload});
}

export const getLoadableDrones: RequestHandler = async (req,res,next) => {
    const drones = await Drone.findAll({
        include: Load,
        where: { state: { [Op.in] : [DroneStateEnum.IDLE,DroneStateEnum.LOADED]},
        batteryPercentage: { [Op.gte]: 25 }}});

    let dronesWithSpace = [];
    for (const drone of drones) {
        let weightInDrone = 0
        await Promise.all(drone.loads.map(async( load) =>{
            const med = await Medication.findOne({where: { id: load.medicationId }});
            weightInDrone += (med?.weight! * load.count);
            
        }));
        console.log("weightInDrone")
        if (weightInDrone != drone.weight) {
                dronesWithSpace.push(drone);
        }            
    }

    return res.status(200)
    .json({data: dronesWithSpace});
}