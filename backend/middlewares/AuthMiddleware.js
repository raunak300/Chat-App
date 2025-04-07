import { request } from "express";
import jwt from "jsonwebtoken";


export const verifyToken=(request,res,next)=>{
    const token=request.cookies.jwt;
    if(!token){
        return res.status(401).send("u are not authenticated");
    }
    jwt.verify(token,process.env.JWT_KEY,async(err,payload)=>{
        if(err)return res.status(403).send("token is not valid");
        request.userId=payload.userId;
        next();
    })



}