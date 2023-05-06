import { RequestHandler } from "express";
import loadService from "../services/load-service";

export const loadMedication: RequestHandler = async (req,res,next) => {

    const { drone, medication } = req.body;

    try {
        const load = await loadService.loadMedicationToDrone(drone,medication);
        return res.status(200)
        .json({message: "Successfully loaded",data: load});
    } catch (error) {
        return next(error);
    }
}