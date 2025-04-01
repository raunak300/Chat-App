import React, { useState } from "react";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client.js"
import { SIGNUP_ROUTE } from "@/utils/constants";



const Auth = () => {
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
    }
    return true; 
  }


  const handelLogin = async () => {

  };
  const handelSignup = async () => {
    if(validateSignup()){
      const response=await apiClient.post(SIGNUP_ROUTE,{email,password}); //going on backend
      console.log(response);
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
            <Tabs className="w-full">
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
                    placeholder="email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="rounded-md p-3 border border-gray-300 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="password"
                    placeholder="password"
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
                    placeholder="email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="rounded-md p-3 border border-gray-300 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    className="rounded-md p-3 border border-gray-300 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="password"
                    placeholder="confirm password"
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