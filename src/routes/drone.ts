import { Router } from "express";
import { deliver, registerDrone, resetDrone } from "../controllers/drone";
import { deliverLoad } from "../services/drone";

const droneRouter = Router();

droneRouter.post("/register",registerDrone);

droneRouter.post("/deliver",deliver);

droneRouter.post("/reset",resetDrone);

export default droneRouter;