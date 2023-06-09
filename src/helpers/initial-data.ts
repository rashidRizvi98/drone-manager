import { Drone } from "../database/models/drone"
import { Medication } from "../database/models/medication"
import { DroneModelEnum, DroneStateEnum } from "../models/drone"
import { getDroneWeightLimit } from "./helper"

export const initializeDefaultData =async () => {
   await Drone.bulkCreate(initialDrones,{ ignoreDuplicates: true, });
   await Medication.bulkCreate(initialMedications,{ ignoreDuplicates: true });
}


const initialDrones = [
    {
        serialNumber: "drone-1",
        model: DroneModelEnum.LIGHTWEIGHT,
        weightLimit: getDroneWeightLimit(DroneModelEnum.LIGHTWEIGHT),
        batteryPercentage: 100,
        distanceToDestination:5,
        state: DroneStateEnum.IDLE
    
    },
    {
        serialNumber: "drone-2",
        model: DroneModelEnum.HEAVYWEIGHT,
        weightLimit: getDroneWeightLimit(DroneModelEnum.HEAVYWEIGHT),
        batteryPercentage: 100,
        distanceToDestination:5,
        state: DroneStateEnum.IDLE  
    },
    {
        serialNumber: "drone-1-test",
        model: DroneModelEnum.LIGHTWEIGHT,
        weightLimit: getDroneWeightLimit(DroneModelEnum.LIGHTWEIGHT),
        batteryPercentage: 100,
        distanceToDestination:5,
        state: DroneStateEnum.IDLE
    
    },
    {
        serialNumber: "drone-2-test",
        model: DroneModelEnum.HEAVYWEIGHT,
        weightLimit: getDroneWeightLimit(DroneModelEnum.HEAVYWEIGHT),
        batteryPercentage: 100,
        distanceToDestination:5,
        state: DroneStateEnum.IDLE  
    },
    {
        serialNumber: "drone-3-test",
        model: DroneModelEnum.LIGHTWEIGHT,
        weightLimit: getDroneWeightLimit(DroneModelEnum.LIGHTWEIGHT),
        batteryPercentage: 24,
        distanceToDestination:5,
        state: DroneStateEnum.IDLE
    
    },
];

const initialMedications = [
    {
        name: "panadol",
        code: "CODE_1",
        weight: 100,
        image: "panadol.jpeg"
    },
    {
        name: "paracetamol",
        code: "CODE_2",
        weight: 50,
        image: "paracetamol.jpeg"
    }
];