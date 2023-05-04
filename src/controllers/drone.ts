import { RequestHandler } from "express";

export const registerDrone: RequestHandler = async (req,res,next) => {

        return res.status(201)
        .json({message: "Drone Registered Successfully", data: null});        
}