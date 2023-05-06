
export interface IDrone {
    id: string;
    serialNumber: string;
    model: DroneModelEnum;
    weight: number;
    batteryPercentage: number;
    state: DroneStateEnum;
    distanceToDestination: number
}

export enum DroneStateEnum {
    IDLE = 'IDLE', 
    LOADING = 'LOADING', 
    LOADED = 'LOADED',
    DELIVERING = 'DELIVERING',
    DELIVERED = 'DELIVERED',
    RETURNING = 'RETURNING'
}

export enum DroneModelEnum {
    LIGHTWEIGHT = 'LIGHTWEIGHT', 
    MIDDLEWEIGHT = 'MIDDLEWEIGHT',
    CRUISERWEIGHT = 'CRUISERWEIGHT',
    HEAVYWEIGHT = 'HEAVYWEIGHT'
}