import React from "react";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client.js"
import { SIGNUP_ROUTE ,LOGIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { useState,useEffect } from "react";
// import {response} from 


const Auth = () => {
  const navigate=useNavigate();
  const {setUserInfo}=useAppStore();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const validateSignup=()=>{
    if(!email.length){
      toast.error("Email is required");
      return false;
    }
    if(!password.length){
      toast.error("Password is required");
      return false;
    }
    if(!confirmPassword.length){
      toast.error("Confirm Password is required");
      return false;
    }
    if(password!==confirmPassword){
      toast.error("Password Should Be Same")
      return false;
    }
    return true; 
  }

  const validateLogin=()=>{
    if(!email.length){
      toast.error("Email is required");
      return false;
    }
    if(!password.length){
      toast.error("Password is required");
      return false;
    }
    return true; 
  }


  const handelLogin = async () => {
    if(validateLogin()){
      const response=await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials:true}); //going on backend and withcridentials to make token
      console.log(response);
    console.log(response.data.user);
    if(response.data.user.id){
      console.log("login hua")
      if(response.data.user.profileSetup){//make sure that if only profile is set up it will go to chat page
        console.log("yha dekha");
        setUserInfo(response.data.user); // this will update userInfo in zustand store
        // Zustand Update: Before navigating, setUserInfo(response.data.user) is called. This updates the user information in the global Zustand store, making it accessible to other parts of the application.
        console.log("yha dekh 2 chat me ja rha hu")
        navigate("/chat");
      }
      else {//also manged when the page is refreshed and the user is not logged in and the profile is not set up
        console.log(response.data.user);
        console.log("yha dkeh profile me ja rha hu - BEFORE setUserInfo");
        setUserInfo(response.data.user);
        console.log("yha dkeh profile me ja rha hu - AFTER setUserInfo");
        console.log("yha dkeh profile me ja rha hu - BEFORE navigate('/profile')");
        navigate("/profile");
        console.log("yha dkeh profile me ja rha hu - AFTER navigate('/profile')");
      }

      
    }
    else{
      console.log("nahi hua bhai")
    }
  }


  };
  const handelSignup = async () => {
    if(validateSignup()){
      const response=await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials:true}); //going on backend and withcridentials to make token
      console.log(response);
      
      //as i do signup i get jwt token now
    
    if(response.status===201){

      setUserInfo(response.data.user);//this will update userinfo before navigating 
      console.log(response.data.user);
      navigate("/profile");
    }
    }
  };


  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white border border-gray-200 text-opacity-90 shadow-xl rounded-3xl overflow-hidden max-w-md w-full md:max-w-lg lg:max-w-xl">
        <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-6 items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl mr-2">
                Welcome
              </h1>
              <img src={Victory} alt="Victory Emoji" className="h-8 md:h-10 lg:h-12" />
            </div>
            <p className="font-medium text-center text-gray-600 mt-2">
              Fill in Details to start with the best Chat App
            </p>
          </div>
          <div className="w-full">
            <Tabs className="w-full" defaultValue="login">
              <TabsList className="bg-gray-100 rounded-lg w-full flex p-1">
                <TabsTrigger
                  value="login"
                  className="w-1/2 text-center p-3 font-semibold transition-all duration-200 focus:outline-none rounded-md data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="w-1/2 text-center p-3 font-semibold transition-all duration-200 focus:outline-none rounded-md data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow"
                >
                  SignUP
                </TabsTrigger>
              </TabsList>
              <div className="mt-6">
                <TabsContent value="login" className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="rounded-md p-3 border border-gray-300 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    className="rounded-md p-3 border border-gray-300 focus:outline-none focus:border-purple-500"
                  />
                  <Button
                    className="rounded-md p-3 bg-zinc-900 text-white font-semibold hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1"
                    onClick={handelLogin}
                  >
                    Login
                  </Button>
                </TabsContent>
                <TabsContent value="signup" className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="rounded-md p-3 border border-gray-300 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    className="rounded-md p-3 border border-gray-300 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                    className="rounded-md p-3 border border-gray-300 focus:outline-none focus:border-purple-500"
                  />
                  <Button
                    className="rounded-md p-3 bg-zinc-900 text-white font-semibold hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1"
                    onClick={handelSignup}
                  >
                    Sign UP
                  </Button>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;