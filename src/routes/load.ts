import { Router } from "express";
import { registerDrone } from "../controllers/drone";
import { loadMedication } from "../controllers/load";
import { validateToLoadMedication } from "../middlewares/load-medication";

const loadRouter = Router();

loadRouter.post("/", validateToLoadMedication, loadMedication);

export default loadRouter;