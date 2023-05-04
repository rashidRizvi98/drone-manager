import { RequestHandler } from "express";
import { Drone } from "../database/models/drone";
import { IDrone } from "../models/drone";

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