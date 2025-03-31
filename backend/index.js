import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
const app=express();

dotenv.config();

const port=process.env.PORT||8000;
const databaseURL=process.env.DATABASE_URL;

app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true
}));

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true,required:true}))


app.use('/api/auth',authRoutes)

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})
mongoose
    .connect(databaseURL)
    .then(()=>{
        console.log("connected to DB")}
    ).catch((err)=>{
        console.log(err.message);
    })

