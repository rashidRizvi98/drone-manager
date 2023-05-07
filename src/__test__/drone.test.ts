import supertest from "supertest";
import { app } from "..";
import droneService from "../services/drone-service";
import { setTimeout } from "timers/promises";

describe("drone", ()=> {
    describe("check drone battery level", ()=> {
        describe("if the drone doesn't exist", ()=> {
            it("should return 404 error", async() => {
                const serialNumber = 'drone-4xxx';
                await supertest(app).get(`/drones/battery-percentage/${serialNumber}`).expect(404);
            });
        }); 

        describe("if the drone exists", ()=> {
            it("should return 200 status with battery percentage", async() => {
                const serialNumber = 'drone-1-test';
                await droneService.rechargeDrone(serialNumber);
                const {statusCode, body} = await supertest(app).get(`/drones/battery-percentage/${serialNumber}`);

                expect(statusCode).toBe(200);
                expect(body.batteryPercentage).toBe("100%");
            });
        }); 
    });
    
    describe("load drone with medications", ()=> {
        describe("after loading a medication, should wait 5 seconds before loading another one", ()=> {
            it("should return 400 error if second request was sent without waiting 5 seconds", async() => {
                const serialNumber = 'drone-2-test';
                await droneService.resetDrone(serialNumber);
                await supertest(app).post(`/load`)
                .send({serialNumber: serialNumber,code: 'CODE_1'});

               const { statusCode, body } = await supertest(app).post(`/load`)
                .send({serialNumber: serialNumber,code: 'CODE_1'});
                
                expect(statusCode).toBe(400);
                expect(body).toEqual({
                    "message": "Please wait until current loading completes"
                });
            });

            it("should return 200 error if second request was sent after 5 seconds", async() => {
                const serialNumber = 'drone-2-test';
                await droneService.resetDrone(serialNumber);
                await supertest(app).post(`/load`)
                .send({serialNumber: serialNumber,code: 'CODE_1'});
                await setTimeout(5000);
               const { statusCode, body } = await supertest(app).post(`/load`)
                .send({serialNumber: serialNumber,code: 'CODE_1'});
                
                expect(statusCode).toBe(200);
                expect({"message": "Successfully loaded"})
            });

            it("should return 400 error if tried to load the drone more than it can carry", async() => {
                const serialNumber = 'drone-1-test';
                await droneService.resetDrone(serialNumber);
                for (let i = 0; i < 2; i++) {
                    await supertest(app).post(`/load`)
                    .send({serialNumber: serialNumber,code: 'CODE_1'});
                    await setTimeout(6000);                                        
                }
               const { statusCode, body } = await supertest(app).post(`/load`)
                .send({serialNumber: serialNumber,code: 'CODE_1'});
                
                expect(statusCode).toBe(400);
                expect(body).toEqual({
                    "message": "Unable to load the medication, drone has reached the capacity"
                })
            });
            
            it("should return 400 error if battery percentage is lower than 25%", async() => {
                const serialNumber = 'drone-3-test';
               const { statusCode, body } = await supertest(app).post(`/load`)
                .send({serialNumber: serialNumber,code: 'CODE_1'});                
                expect(statusCode).toBe(400);
                expect(body).toEqual({
                    "message": "The battery level is lower than 25%, please recharge"
                })
            });
        }); 
    });
});