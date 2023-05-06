import { Router } from "express";
import { checkBatteryPercentage, deliver, getLoadableDrones, getLoadedMedications, rechargeDrone, registerDrone, resetDrone } from "../controllers/drone";

const droneRouter = Router();

droneRouter.post("/register",registerDrone);

droneRouter.post("/deliver",deliver);

droneRouter.post("/reset",resetDrone);

droneRouter.post("/recharge",rechargeDrone);

droneRouter.get("/battery-percentage/:serialNumber",checkBatteryPercentage);

droneRouter.get("/load/:serialNumber",getLoadedMedications);

droneRouter.get("/available",getLoadableDrones);

export default droneRouter;