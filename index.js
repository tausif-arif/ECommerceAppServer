import express  from 'express';
import dotenv from 'dotenv'
import { conn } from './config/connection.js';
import { defaultData } from './default.js';
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'

import cors from 'cors';

dotenv.config()

const app =express();



app.use(cors())

// db connection

const username=process.env.DB_USERNAME
const password=process.env.DB_PASSWORD
conn(username,password);


app.use(express.json());
// app.use(express.urlencoded({
//   extended:false
// }));



app.use('/user',userRoutes) //user routes
app.use('/product',productRoutes) //product routes


const PORT=9090;

app.listen(PORT,()=>console.log('server is running on',PORT));


defaultData();  //importing default data to db