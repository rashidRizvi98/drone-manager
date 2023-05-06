import { RequestHandler } from "express";
import { IDrone } from "../models/drone";
import { validationResult } from "express-validator";
import { getLogger } from "../helpers/logger";
import droneService from "../services/drone-service";

const logger = getLogger("DRONE CONTROLLER")

export const registerDrone: RequestHandler = async (req,res,next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logger.debug(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const payload : IDrone = req.body;
    try {
        const [registeredDrone ,created] = await droneService.registerDrone(payload);
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
    
    try {
        const drones = await droneService.findAllDrones();
        return res.status(200)
        .json({message: "Success",data: drones});        
    } catch (error) {
        return next(error);    
    }
}

export const deliver: RequestHandler = async (req, res, next) => {
    const { drone } = req.body;

    try {
        droneService.deliverLoad(drone);        
        return res.status(200)
        .json({message: "Delivery in progress..."});
    } catch (error) {
        return next(error);
    }
}

export const resetDrone: RequestHandler = async (req,res,next) => {
    const { serialNumber } = req.body
    try {
        await droneService.resetDrone(serialNumber);
        return res.status(200)
        .json({message: "Successfully Reset"});
            
    } catch (error) {
        return next(error);
    }
}

export const rechargeDrone: RequestHandler = async (req,res,next) => {
    const { serialNumber } = req.body

    try {
        await droneService.rechargeDrone(serialNumber);
        return res.status(200)
        .json({message: "Successfully Recharged"});
    } catch (error) {
        return next(error);
    }
}

export const checkBatteryPercentage: RequestHandler = async (req,res,next) => {
    const { serialNumber } = req.params
    try {
        const batteryPercentage = await droneService.getBatteryPercentage(serialNumber);
        return res.status(200)
        .json({ batteryPercentage: `${batteryPercentage}%` });        
    } catch (error) {
        return next(error);
    }
}

export const getLoadedMedications: RequestHandler = async (req, res, next) => {
    const { serialNumber } = req.params;

    try {
        const loadedMedications = await droneService.getLoadedMedicationsInDrone(serialNumber);
        return res.status(200)
        .json({data: loadedMedications});        
    } catch (error) {
        return next(error);
    }

}

export const getLoadableDrones: RequestHandler = async (req,res,next) => {

    try {
        const availableDrones = await droneService.getDronesAvailableForLoading();
        return res.status(200)
        .json({data: availableDrones});
    
    } catch (error) {
        return next(error);
    }
}