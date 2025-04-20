import { request, response } from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';
import {renameSync,unlinkSync } from "fs";


const maxAge=3*24*60*60*1000;

const createToken=(email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge})
}

export const signup=async function(request,response,next){
    try{
        const {email,password}=request.body;
        if(!email || !password){
            return response.status(400).send("Email and Password are required");
        }
        const user=await User.create({email,password});
        response.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        return response.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,
            }
        })

    }catch(err){
        console.log({err});
        return response.status(500).send("Internal server Error");
    }

}

 
export const login=async function(request,response,next) {
    try {
        const {email,password}=request.body;
        if(!email || !password){
            return response.status(400).send("email and password are required");
        }
        const user=await User.findOne({
            email,
        })
        if(!user){
            console.log("no user exist");
            return response.status(404).send("email or password is incorrect");
        }
        const auth=await bcrypt.compare(password,user.password);
        if(!auth){
            return response.status(404).send("email or password is incorrect")
            //password is incorrect but we writ email or password for hacer to not gain info

        }
        response.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        return response.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color
            }
        })

        
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
}

export const getUserInfo=async function(request,response,next){
    try {
        
        console.log(request.userId)
        const userData=await User.findById(request.userId);
        if(!userData)return response.status(401).send("user not found");
        
        return response.status(200).json({
            
                id:userData.id,
                email:userData.email,
                profileSetup:userData.profileSetup,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
                color:userData.color
            
    })

        
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
}

export const updateProfile=async function(request,response,next){
    try {
        
        const {userId}=request
        const {firstName,lastName,color}=request.body
        if(!firstName || !lastName  )return response.status(400).send("First Name, Last Name and color is required");
        const userData=await User.findByIdAndUpdate(userId,{
            firstName,lastName,color,profileSetup:true
        },{new:true,runValidators:true}) //return and validate the data and sends error if not valid and updated in db
        if(!userData)return response.status(401).send("user not found");
        return response.status(200).json({
            
                id:userData.id,
                email:userData.email,
                profileSetup:userData.profileSetup,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
                color:userData.color
            
    })

        
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
}


export const addProfileImage=async (request,response,next) => {
    try {
        
        if(!request.file){
            return response.status(400).send("image is required");
        }
        console.log("request.file:", request.file); // Check if multer is processing the file
        const date=Date.now();
        let fileName="uploads/profiles/"+date+request.file.originalname; //this will give stored file name based ondate and originalname
        let tempPath=request.file.path;
        try {
            renameSync(tempPath, fileName); //rename synchronously
            console.log("File renamed successfully");
          } catch (renameError) {
            console.error("Error during file rename:", renameError);
            return response.status(500).json({ message: "Error saving image." });
          }
            console.log("request.userId:", request.userId); 
            const updatedUser=await User.findByIdAndUpdate(
            request.userId,
            {image:fileName},
            {new:true,runValidators:true} //this updates the user and return the updated user
          )
        console.log("Updated user:", updatedUser);
        if (updatedUser) {
            console.log("Updated user image path:", updatedUser.image);
     }
    

        return response.status(200).json({
                image:updatedUser.image,
    })

        
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
}

export const removeProfileImage=async(request,response,next)=>{
    try {
        
        const {userId}=request;
        const user=await User.findById(userId);
        if(!user)return response.status(401).send("no user found");
        if(!user.image) return response.status(400).send("no image exist for user");
        if(user.image){
            unlinkSync(user.image);
        } //this will remove the image from the server
        user.image=null;//remove image from db
        await user.save();
        return response.status(200).send("image removed succesfully");

        
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
}


export const logout=async(request,response,next)=>{
    try {
        
        response.cookie("jwt","",{maxAge:1,sameSite:"None",secure:true});
        return response.status(200).send("Logout Successfull");

        
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
}