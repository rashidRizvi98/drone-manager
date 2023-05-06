import { body } from "express-validator"
import { enumToArray } from "../helpers/helper"
import { DroneModelEnum } from "../models/drone"


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