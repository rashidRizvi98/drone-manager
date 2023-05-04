import { Router } from "express";
import { registerDrone } from "../controllers/drone";
import { createMedication } from "../controllers/medication";
import { upload } from "../middlewares/file-upload";

const medicationRouter = Router();

medicationRouter.post("/create",upload.single('image'),createMedication);

export default  medicationRouter;