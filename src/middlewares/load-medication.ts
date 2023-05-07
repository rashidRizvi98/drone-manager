import { NextFunction, Request, Response } from "express";
import { Drone } from "../database/models/drone";
import { Medication } from "../database/models/medication";
import { DroneStateEnum } from "../models/drone";

export const validateToLoadMedication = async (req: Request, res: Response, next: NextFunction) => {
    const { serialNumber, code } = req.body

    try {
        const drone = await Drone.findOne({ where:{ serialNumber }});

        if (!drone) {
            return res.status(400).json({ message: 'Invalid serial number' });
        }

        if (drone.state == DroneStateEnum.DELIVERING) {
            return res.status(400).json({ error: 'On a delivery, please wait.' });
        }
      
        if (drone.state == DroneStateEnum.DELIVERED) {
          return res.status(400).json({ error: 'Unloading a delivery, please wait.' });
        }
    
        if (drone.state == DroneStateEnum.RETURNING) {
          return res.status(400).json({ error: 'Returning from delivery, please wait.' });
        }
    
        const medication = await Medication.findOne({ where:{ code }});
    
        if (!medication) {
            return res.status(400).json({ message: 'Invalid medication code' });
        }
    
        if (drone?.batteryPercentage! < 25) {
            return res.status(400).json({ message: 'The battery level is lower than 25%, please recharge' });
        }
    
        if (drone?.state == DroneStateEnum.LOADING) {
            return res.status(400).json({ message: 'Please wait until current loading completes' });
        }
    
        req.body.drone = drone;
        req.body.medication = medication;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}