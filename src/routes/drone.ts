import { Router } from "express";
import { registerDrone } from "../controllers/drone";

const droneRouter = Router();

droneRouter.post("/register",registerDrone);

export default droneRouter;