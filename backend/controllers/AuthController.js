import { response } from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
const {sign}=jwt;

const maxAge=3*24*60*60*1000;

const createToken=(email,userId)=>{
    return sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge})
}

export const signup=async function(req,res,next){
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("email and password are required");
        }
        const user=await User.create({email,password});
        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        return res.status(200).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,
            }
        })

    }catch(err){
        console.log({err});
        return res.status(500).send("Internal server Error");
    }

}



