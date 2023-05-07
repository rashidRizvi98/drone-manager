import { DroneModelEnum } from "../models/drone";

export const getDroneWeightLimit = (droneModel: DroneModelEnum) => {
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

export const getPagination = (page: number, size: number) => {
    const limit = size ? size : 5;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };