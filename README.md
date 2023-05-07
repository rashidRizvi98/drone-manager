# Drone-manager

This is an application to deliver medications using drones, written using node js(v16.16.0), express, typescript(version 5.0.4). Postgres has been used as database. Images are stored at s3.

to run Postgres as a docker container please run following command in a terminal

        sudo docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=password -d postgres


to clone the code please run

        git clone https://github.com/rashidRizvi98/drone-manager.git

After cloning the code, to provide environment variable values, please create a .env file and add the keys and values which are required at src/config/index.ts

within root folder of the project, please run following commands

        npm install
        npm start

Now the application is available at http://localhost:5000
## Functionalities

* Register a drone.(by default few drones are created for you on application startup)
* Create a medication in inventory.(by default few medications are created for you on application startup)

* Load a drone with available medications.

* Get the list of medications loaded in a drone.

* Get the list of drone available for loading.

* Check the battery pecentage of a drone

* Deliver the loads.

* Recharge a drone.

* Reset a drone.(will make the state idle, unload the medications, recharge)

* Cron job to log and insert drone battery levels to db.

* Get all/ a drone's battery level log history.

## Assumptions

* A drone will deliver only to one specific location(distance to destinations needs to be provided when registering).

* A drone can not be loaded with medications if battery percentage is less than 25%

* Different types of drones have different amount of weight limits(LIGHTWEIGHT= 200g, MIDDLEWEIGHT= 300g, CRUISERWEIGHT= 400g, HEAVYWEIGHT= 2   500g)

* Different type of / Same type of medication can be loaded multiple times until it reaches drone capacity

* For each 1km, 4% of battery will be consumed. 
eg: battery level of a fully charged drone, after 5km distance delivery(up and down) 100 - 10 * 4 = 60%

* Drone will be in 'LOADED' state, if it has been loaded with atleast one medication

* Drones which are in 'IDLE' state and 'LOADED'(have space) are considered to be available for loading.

* Loding a medication takes 5 seconds. during this period another medication can not be loaded. To unload whole delivery it takes 5 seconds.

* A drone takes 2 seconds to travel 1km. So 5km destination delivery, it will take
20 seconds(up+down+unloading)

* Drone can not be loaded with medications until it returns from a delivery.

## Endpoints

On server startup two drones ( serialNumbers:- ***drone-1, drone-2***) and medications( code:- ***CODE_1, CODE_2*** ) will be created. So you can use these existing data to load and deliver
<br>
<br>
###  Load a drone

POST http://localhost:5000/load

json payload:-

        {
                "serialNumber": "drone-1",
                "code": "CODE_1"
        }
<br><br>
###  List of medications loaded in drone

GET http://localhost:5000/drones/load/drone-1

<br>

###  Deliver

POST http://localhost:5000/drones/deliver

        {
           "serialNumber":"drone-1"
        }
<br>

### Check battery level of a drone

GET http://localhost:5000/drones/battery-percentage/drone-1

<br>

### Recharge a drone

POST http://localhost:5000/drones/recharge

json payload:-

        {
                "serialNumber": "drone-1"
        }

<br>

### Get the list of drones available for loading

GET http://localhost:5000/drones/available

<br>

### Reset a drone

POST http://localhost:5000/drones/reset

json payload:-

        {
                "serialNumber":"drone-1"
        }
<br>

###  Register a drone

POST http://localhost:5000/drones/register

json payload:-

        {
                "serialNumber": "drone-3",
                "model": "MIDDLEWEIGHT",
                "batteryPercentage": 100,
                "distanceToDestination":5
        }

<br>

### Create Medication

POST http://localhost:5000/medications/create

Accepts form data with image file.
fields: code, name, weight, image(jpg,jpeg,png)

<br>

### Get all drones' battery level logs

GET http://localhost:5000/logs?page=1&size=50

<br>

### Get battery level logs of a drone

GET http://localhost:5000/logs/drone-1?page=1&size=50

## Unit testing

test cases has been written for following, using jest and supertest.

* check drone batter level
* load drones with medication(validate drone availability, battery percentage etc.)

to run execute the tests please run

        npm run test