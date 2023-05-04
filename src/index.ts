import express,{Express} from 'express';
import 'dotenv/config';
import { port } from './config';
import droneRouter from './routes/drone';

const app: Express=express()

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.use(express.json())

app.use("/drones",droneRouter);


app.listen(port,()=>{
    console.log(`SERVER IS RUNNING AT: ${port}`)
});