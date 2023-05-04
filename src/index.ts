import express,{Express} from 'express';
import 'dotenv/config';
import { port } from './config';
import droneRouter from './routes/drone';
import { initializeDatabase } from './database';
import medicationRouter from './routes/medication';


const app: Express=express()

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.use(express.json())

app.use("/drones",droneRouter);

app.use("/medications",medicationRouter);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({message: err.message});
  }
);

initializeDatabase();

app.listen(port,()=>{
    console.log(`SERVER IS RUNNING AT: ${port}`)
});