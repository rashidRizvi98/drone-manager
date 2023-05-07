import express,{Express} from 'express';
import 'dotenv/config';
import { port } from './config';
import droneRouter from './routes/drone';
import { initializeDatabase } from './database';
import medicationRouter from './routes/medication';
import loadRouter from './routes/load';
import { getLogger } from './helpers/logger';
import { HttpError } from './helpers/custom-error';
import logRouter from './routes/battery-level-log';

const logger = getLogger('MAIN');
export const app: Express=express()

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.use(express.json())

app.use("/drones",droneRouter);

app.use("/medications",medicationRouter);

app.use("/load",loadRouter);

app.use("/logs",logRouter);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof HttpError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

initializeDatabase();

app.listen(port,()=>{
  logger.info(`SERVER IS RUNNING AT: ${port}`);
});