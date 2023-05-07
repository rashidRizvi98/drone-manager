import { RequestHandler } from "express";
import { BatteryLevelLog } from "../database/models/battery-level-log";
import { getPagination } from "../helpers/helper";

export const getAllLogs: RequestHandler = async (req,res,next) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(Number(page), Number(size));
    try {
       const logs = await BatteryLevelLog.findAndCountAll({ limit, offset });
        return res.status(200)
        .json({logs});
            
    } catch (error) {
        return next(error);
    }
}

export const getAllLogsForADrone: RequestHandler = async (req,res,next) => {
    const { serialNumber } = req.params
    const { page, size } = req.query;
    const { limit, offset } = getPagination(Number(page), Number(size));
    try {
       const logs = await BatteryLevelLog.findAndCountAll({where: { serialNumber }, limit, offset });
        return res.status(200)
        .json({logs});
            
    } catch (error) {
        return next(error);
    }
}