import { Router } from "express";
import { registerDrone } from "../controllers/drone";
import { loadMedication } from "../controllers/load";

const loadRouter = Router();

loadRouter.post("/",loadMedication);

export default loadRouter;