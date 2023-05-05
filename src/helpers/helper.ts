import { DroneModelEnum } from "../models/drone";

export const getDroneWeight = (droneModel: DroneModelEnum) => {
    switch (droneModel) {
        case DroneModelEnum.LIGHTWEIGHT:
            return 200;
        case DroneModelEnum.MIDDLEWEIGHT:
            return 300;
        case DroneModelEnum.CRUISERWEIGHT:
            return 400;
        case DroneModelEnum.HEAVYWEIGHT:
            return 500;
    }
}

export const enumToArray = (enumm: any) => {
    return Object.keys(enumm).map(key => enumm[key]);
}