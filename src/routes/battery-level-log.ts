import { Router } from "express";
import { getAllLogs, getAllLogsForADrone } from "../controllers/battery-level-log";

const logRouter = Router();

logRouter.get("/",getAllLogs);

logRouter.get("/:serialNumber",getAllLogsForADrone);

export default logRouter;