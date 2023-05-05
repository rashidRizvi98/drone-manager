import { RequestHandler } from "express";
import { Drone } from "../database/models/drone";
import { DroneStateEnum, IDrone } from "../models/drone";
import { deliverLoad } from "../services/drone";
import { Load } from "../database/models/load";

export const registerDrone: RequestHandler = async (req,res,next) => {
    const payload : IDrone = req.body;
    const [registeredDrone ,created] = await Drone.findOrCreate({
        where: { serialNumber: payload.serialNumber },
        defaults: {serialNumber: payload.serialNumber,battery: payload?.battery,weight:payload?.weight,model: payload?.model,state:payload?.state }
    });

    if (created) {
        return res.status(201)
        .json({message: "Drone Registered Successfully", data: registeredDrone});        
    }else{
        return res.status(200)
        .json({message: "Drone has been alrady registered", data: registeredDrone});
    }
}

export const findAllDrones: RequestHandler = async (req, res, next) => {
    const drones = await Drone.findAll();

    return res.status(200)
    .json({message: "Success",data: drones});
}

export const deliver: RequestHandler =async (req, res, next) => {
    const drone = await Drone.findByPk(req.body.droneId);

    if(drone?.state != DroneStateEnum.LOADED)
    return next(new Error("Drone is not Loaded"));

    if (drone) {
        await drone.update({state: DroneStateEnum.DELIVERING})
        deliverLoad(drone);
    }
    return res.status(200)
    .json({message: "Delivery in progress..."});
}

export const resetDrone: RequestHandler =async (req,res,next) => {
    const {droneId} = req.body
    Drone.update({state: DroneStateEnum.IDLE},{where:{ id: droneId }})
    Load.destroy({where:{ droneId }});
    return res.status(200)
    .json({message: "Successfully Reset"});
}