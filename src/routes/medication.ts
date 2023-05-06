import { Router } from "express";
import { registerDrone } from "../controllers/drone";
import { createMedication } from "../controllers/medication";
import { upload } from "../middlewares/file-upload";
import { medicationCreationInputValidator } from "../middlewares/medication-input-validator";

const medicationRouter = Router();

medicationRouter.post("/create",upload.single('image'), medicationCreationInputValidator(),createMedication);

export default  medicationRouter;