import { RequestHandler } from "express";
import { Drone } from "../database/models/drone";
import { DroneStateEnum, IDrone } from "../models/drone";
import { ILoad } from "../models/load";
import { Load } from "../database/models/load";
import { loadDrone } from "../services/drone";
import { Medication } from "../database/models/medication";

export const loadMedication: RequestHandler = async (req,res,next) => {
    const payload : {serialNumber:string,code: string} = req.body;
    const { serialNumber, code } = payload
    const drone = await Drone.findOne({ where:{ serialNumber }});

    if (!drone) {
        return next(new Error("Invalid serial number"));        
    }

    const medication = await Medication.findOne({ where:{ code }});

    if (!medication) {
        return next(new Error("Invalid medication code"));        
    }

    if (drone?.batteryPercentage! < 25) {
        return next(new Error("The battery level is lower than 25%, please recharge"));
    }

    if (drone?.state == DroneStateEnum.LOADING) {
        return next(new Error("Please wait until current loading completes"));
    }

    const droneLoad = await Load.findAll({ where: { serialNumber: drone.serialNumber }});
    let currentWeightInDrone = 0;
    for (const load of droneLoad) {
        const med = await Medication.findOne({where: { code: load.code }});
        currentWeightInDrone += (med?.weight! * load.count);
    }

    if (drone.weight < currentWeightInDrone + medication.weight) {
        return next(new Error("Unable to load the medication, drone has reached the capacity"));
    }

    const loadExists = await Load.findOne({where: { serialNumber: drone?.serialNumber,code: medication.code }});
    loadDrone(drone.id);
    let load = null;
    if (loadExists) {
       load = await loadExists.update({count: ++loadExists.count})
    
    }else{
        load = await Load.create({ serialNumber: drone.serialNumber, code: medication.code, count:1 });
    }

    return res.status(200)
    .json({message: "Successfully loaded",data: load});

}