import express,{Express} from 'express';
import 'dotenv/config';
import { port } from './config';

const app: Express=express()

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  

app.listen(port,()=>{
    console.log(`SERVER IS RUNNING AT: ${port}`)
})