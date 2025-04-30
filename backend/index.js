import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import contactsRoutes from './routes/ContactsRoutes.js';
import setupSocket from './socket.js';
const app=express();

dotenv.config();

const port=process.env.PORT||8000;
const databaseURL=process.env.DATABASE_URL;

app.use(cors({  //coming from frontend
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true
}));

app.use("/uploads/profiles",express.static("uploads/profiles"))//this will serve the image from upload folder to client and 

//express.static serves image and provide it to client
//"/uploads/profiles" will act as url for image and client to acess it as it is stored in uploads/profile 
//so when client will access this url it will get the image from the server


app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true,required:true}))



app.use('/api/auth',authRoutes)
//app.use(...): This is middleware in Express. It means that for any request that starts with the path /api/auth, your authRoutes router will be used to handle it.

app.use('/api/contacts',contactsRoutes)

const server=app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})

setupSocket(server) //after creation of server we need to do this

mongoose
    .connect(databaseURL)
    .then(()=>{
        console.log("connected to DB")}
    ).catch((err)=>{
        console.log(err.message);
    })

