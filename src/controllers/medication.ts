import { RequestHandler } from "express";
import { IMedication } from "../models/medication";
import { Medication } from "../database/models/medication";
import { getPreSignedUrl } from "../middlewares/file-upload";
import { validationResult } from "express-validator";
import { getLogger } from "../helpers/logger";

const logger = getLogger("MEDICATION CONTROLLER")

export const createMedication: RequestHandler = async (req,res,next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logger.debug(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const payload : IMedication = req.body;
    try {
        const [medication ,created] = await Medication.findOrCreate({
            where: { code: payload.code },
            defaults: {code: payload.code,name: payload.name,weight: payload.weight, image: (req?.file as any)?.key}
        });
        const responsePayload = {...medication?.dataValues,image: await getPreSignedUrl((req.file as any)?.key)}
        if (created) {
            return res.status(201)
            .json({message: "Medication created Successfully", data: responsePayload});        
        }else{
            return res.status(200)
            .json({message: "Medication has been already created", data: responsePayload});
        }        
    } catch (error) {
        return next(error)
    }

}