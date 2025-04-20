import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { useAppStore } from "@/store";
import {response} from "react";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { FiEdit2 } from "react-icons/fi";
import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger} from "@/components/ui/tooltip" 
import {IoLogOut, IoPowerSharp} from "react-icons/io5"
import { Navigate, useNavigate } from "react-router-dom";
import {LOGOUT_ROUTE} from "@/utils/constants"
import apiClient from "@/lib/api-client";
const ProfileInfo = () => {
    const navigate= useNavigate()
    const {userInfo,setUserInfo} = useAppStore();
    const image=userInfo.image;
    const firstName=userInfo.firstName;

    const logOut=async()=>{
        try {
            const response=await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true});
            if(response.status===200){
                navigate("/auth") //first navigate then or make setUserInfro null
                setUserInfo(null)
            }
        } catch (error) {
            console.log(error);
        }
    }
    
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33] ">
        <div className="flex gap-3 items-center justify-center">
            <div className="w-12 h-12 relative ">
            <Avatar className="h-13 w-13 md:w-14 md:h-14 rounded-full overflow-hidden ">
              {
                image ? (
                <AvatarImage  src={`${HOST}${userInfo.image}`} 
                alt="profile" 
                className="object-cover w-full h-full bg-black"   />
                ) : 
                (<div className={`uppercase h-13 w-13 md:h-14 md:w-14 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}
                 `}>
                {
                  
                  userInfo.firstName
                  ? userInfo.firstName.split("").shift() 
                  : userInfo.email.split("").shift()
                }
                </div>
              )}
          </Avatar>
            </div>
            <div className="flex">
              {
                userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
              }
            </div>
        </div>
        <div className="flex gap-5">
        <TooltipProvider >
            <Tooltip className>
                <TooltipTrigger >
                    <FiEdit2 className="text-purple-500 font-medium text-xl"
                    onClick={()=>navigate("/profile")}
                    />
                </TooltipTrigger>
                <TooltipContent className=" bg-[#2a2b33] p-2 border-none rounded-md" >
                    <p className="text-xl text-purple-500 ">Edit Profile</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <TooltipProvider >
            <Tooltip className>
                <TooltipTrigger >
                    <IoPowerSharp className="text-red-500 font-medium text-xl"
                    onClick={()=>logOut()}
                    />
                </TooltipTrigger>
                <TooltipContent className=" bg-[#2a2b33] p-2 border-none rounded-md" >
                    <p className="text-xl text-red-500 ">Log Out</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        </div>
    </div>
  )
}

export default ProfileInfo