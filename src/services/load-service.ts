import { Drone } from "../database/models/drone";
import { Load } from "../database/models/load";
import { Medication } from "../database/models/medication";
import { HttpError } from "../helpers/custom-error";
import droneService from "./drone-service";

const loadMedicationToDrone = async (drone: Drone, medication: Medication) => {

    const droneLoad = await Load.findAll({ where: { serialNumber: drone.serialNumber }});
    let currentWeightInDrone = 0;

    for (const load of droneLoad) {
        const med = await Medication.findOne({where: { code: load.code }});
        currentWeightInDrone += (med?.weight! * load.count);
    }

    if (drone.weightLimit < currentWeightInDrone + medication.weight) {
        throw new HttpError(400,"Unable to load the medication, drone has reached the capacity");
    }

    const loadExists = await Load.findOne({where: { serialNumber: drone?.serialNumber,code: medication.code }});
    droneService.loadDrone(drone.id);
    let load = null;
    if (loadExists) {
       load = await loadExists.update({count: ++loadExists.count})
    
    }else{
        load = await Load.create({ serialNumber: drone.serialNumber, code: medication.code, count:1 });
    }
    return load;
}

export default { loadMedicationToDrone };