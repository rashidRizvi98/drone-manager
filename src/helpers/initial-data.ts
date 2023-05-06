import { Drone } from "../database/models/drone"
import { Medication } from "../database/models/medication"
import { DroneModelEnum, DroneStateEnum } from "../models/drone"
import { getDroneWeight } from "./helper"

export const initializeDefaultData =async () => {
   await Drone.bulkCreate(initialDrones,{ updateOnDuplicate: ['serialNumber'] });
   await Medication.bulkCreate(initialMedications,{ updateOnDuplicate: ['code'] });
}


const initialDrones = [
    {
        serialNumber: "drone-1",
        model: DroneModelEnum.LIGHTWEIGHT,
        weight: getDroneWeight(DroneModelEnum.LIGHTWEIGHT),
        batteryPercentage: 100,
        distanceToDestination:5,
        state: DroneStateEnum.IDLE
    
    },
    {
        serialNumber: "drone-2",
        model: DroneModelEnum.HEAVYWEIGHT,
        weight: getDroneWeight(DroneModelEnum.HEAVYWEIGHT),
        batteryPercentage: 100,
        distanceToDestination:5,
        state: DroneStateEnum.IDLE  
    }
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