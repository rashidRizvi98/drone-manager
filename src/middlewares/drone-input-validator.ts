import { body } from "express-validator"
import { enumToArray } from "../helpers/helper"
import { DroneModelEnum, DroneStateEnum } from "../models/drone"
import { NextFunction, Request, Response } from "express";
import { Drone } from "../database/models/drone";


export const droneRegistrationInputValidator = ()=> {
    return [
    body('serialNumber')
      .isLength({ min: 1 })
      .withMessage('Serial number must be at least 1 char long')
      .isLength({ max: 100 })
      .withMessage('Serial number can be maximum 100 char long')
      .exists()
      .withMessage('Serial number is required')
      .trim()
      .escape(),
    body('model').isIn(enumToArray(DroneModelEnum))
      .withMessage('Model type must be among followings: LIGHTWEIGHT, MIDDLEWEIGHT, CRUISERWEIGHT, HEAVYWEIGHT')
      .exists()
      .withMessage('Drone model is required')
      .trim()
      .escape(),
    body('batteryPercentage')
      .isInt({ min: 1, max: 100 })
      .withMessage('Battery percentage must be more than 0 and not more than 100')
      .exists()
      .withMessage('Battery percentage is required'),
    body('distanceToDestination')
      .isFloat({ min: 1, max: 5 })
      .withMessage('Destination should be atleast 1km long and not more than 5kms')
      .exists()
      .withMessage('Distance to destination is required'),
  ];
};

export const validateDroneForDelivery = async (req: Request, res: Response, next: NextFunction) => {
  const { serialNumber } = req.body;

  try {
    const drone = await Drone.findOne({where: { serialNumber: serialNumber }});
    if (!drone) {
      return res.status(400).json({ error: 'Invalid serial number' });
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
  
    if(drone?.state != DroneStateEnum.LOADED)
      return res.status(400).json({ error: 'Drone is not Loaded' });
  
    req.body.drone = drone;
    next();
    
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }




}