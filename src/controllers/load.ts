import { RequestHandler } from "express";
import { Drone } from "../database/models/drone";
import { DroneStateEnum, IDrone } from "../models/drone";
import { ILoad } from "../models/load";
import { Load } from "../database/models/load";
import { loadDrone } from "../services/drone";

export const loadMedication: RequestHandler = async (req,res,next) => {
    const payload : ILoad = req.body;
    const {droneId, medicationId} = payload
    const drone = await Drone.findByPk(droneId);
    if (drone?.state == DroneStateEnum.LOADING) {
        return next(new Error("Please wait until current loading completes"))
    }
    const loadExists = await Load.findOne({where: { droneId,medicationId }})
    loadDrone(droneId);
    let load = null;
    if (loadExists) {
       load = await loadExists.update({count: ++loadExists.count})
    
    }else{
        load = await Load.create(payload);
    }

    return res.status(200)
    .json({message: "Successfully loaded",data: load});

}