import { useAppStore } from "@/store"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import{IoArrowBack} from 'react-icons/io5'
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import {Input} from "@/components/ui/input"
import { colors } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE,UPDATE_PROFILE_ROUTE } from "@/utils/constants";

//got the user info from store and will be using it in profile page to update the profile after login/signup
 

const Profile = () => {
  const Navigate=useNavigate();
  const {userInfo,setUserInfo} = useAppStore();
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [image, setImage] = useState(null)
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0)
  const fileInputRef=useRef(null)


  useEffect(()=>{
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName)
      setLastName(userInfo.lastName)
      setSelectedColor(userInfo.color)
    }
    if(userInfo.image){
      setImage(`${HOST}${userInfo.image}`) //this will set image in state and used as profile pic;
    }else{
      console.log("no image found");
    }
  },[userInfo])//this will run when userInfo changes and will set the image in state and used as profile pic

  const validateProfile=()=>{
    if(!firstName){
      toast.error("first name is required");
      return false;
    }
    if(! lastName){
      toast.error("last name is required");
      return false;
    }
    //color thing as well must exist
    return true; 
  }

  const saveChanges=async()=>{
    if(validateProfile()){
      try {
        const response=await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName,lastName,color:selectedColor},{withCredentials:true});
        if(response.status===200 || response.data){
          setUserInfo({...response.data})
          toast.success("Profile updated successfully")
          Navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handelNavigate=async()=>{
    if(userInfo.profileSetup){
      Navigate("chat");
    }else{
      toast.error("Please setup your account first");
    }
  }

  const handelFileInputClick=async()=>{
    //alert("clicked");
    fileInputRef.current.click()
  }

  const handelImageChange=async(event)=>{
    const file=event.target.files[0] // to get image from the file input while [0] is used to get the first sile from the input
    if(file){
      const formData=new FormData(); //this will send image to server as form data
      formData.append("profile-image",file) //this will append the image to fordm data that will be sent to server
      const response=await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true});
       //this will send image to server as form data if user is logged in and will return the image url
       if(response.status===200){
        console.log(response.data);
        setUserInfo({...userInfo,image:response.data.image}) //this will set image in the user info in store and used as profile pic
        toast.success("image updted sucessfully")
       }
      //  const reader=new FileReader()// this will read the  image file and change it to base64 for use in app
      //  reader.onload=()=>{ //the is called at time of reading the file and return the result in base64 format
      //   setImage(reader.result)//this will set image in state and used as profile pic
      //   //abovethings are used to set image in state and use it as profile pic
      //  }
      //  reader.readAsDataURL(file);//this will read file and chage to base64 format
    }

  }

  const handelDeleteImage=async()=>{
    try {
      const response= await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{withCredentials:true});
      if(response.status===200){
        setUserInfo({...userInfo,image:null});
        toast.success("image removed successfully");
        setImage(null);//image is set null to remove image from state and set it to null again
      }
    } catch (error) {
      console.log(error);
    }

  }

  return ( 
    <div className="bg-[#1b1c24] h-[100vh] flex flex-col items-center justify-center gap-10 ">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div className="">
          <IoArrowBack  className="text-4xl lg:text-6xl text-white/90 cursor-pointer "  onClick={handelNavigate}/>
        </div>
        <div className="grid grid-cols-2">

        <div className="h-full w-32 md:w-48 md:h-48 flex items-center justify-center relative"
        onMouseEnter={()=>{
          setHovered(true);
          
        }}
        onMouseLeave={()=>{
          setHovered(false)
        }}
        >
          <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {
                image ? (
                <AvatarImage  src={image} 
                alt="profile" 
                className="object-cover w-full h-full bg-black"   />
                ) : 
                (<div className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)} `}>
                {
                  
                  firstName
                  ? firstName.split("").shift() 
                  : userInfo.email.split("").shift()
                }
                </div>
              )}
          </Avatar>
          {
            hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer " 
              onClick={image ? handelDeleteImage : handelFileInputClick}
              >
                {
                  image ? <FaTrash className="text-white text-3xl cursor-pointer " />: <FaPlus className="text-white text-3xl cursor-pointer " />
                }
              </div>
            )
          }
          <input type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handelImageChange} 
          name="profile-image"
          accept=".png, .jpg, .jpeg, .svg, .webp"/>
        </div>
        <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-whilte items-center justify-center">
          <div className="w-full">
            <Input placeholder="Email" type="email" disabled value={userInfo.email} className="rounded-lg text-white p-6 border-none bg-[#2c2e3b]" />
          </div>
          <div className="w-full">
            <Input placeholder="FirstName" 
            type="text" 
            onChange={(e)=>
              setFirstName(e.target.value)
            }
            value={firstName} 
            className="rounded-lg text-white p-6 border-none bg-[#2c2e3b]" />
          </div>
          <div className="w-full">
            <Input placeholder="LastName"
            type="text" 
            onChange={(e)=>
              setLastName(e.target.value)
            }
            value={lastName}   
            className="rounded-lg text-white p-6 border-none bg-[#2c2e3b]" />
          </div>
          <div className="w-full flex gap-5">
  {
    colors.map((color, index) => (
      <div
        className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
          selectedColor === index ? "outline-1 outline-white/50" : ""}
        }`}
        key={index}
        onClick={()=>{
          setColor(index);
        }}
      >
      </div>
    ))
  }
</div>
        </div>

      </div>
      </div>
      <div className="w-full flex items-center justify-center gap-10">
      <Button
          className={`h-16 w-[40vh] text-white hover:bg-purple-900 transition-all duration-300 ${colors[selectedColor]}`}
          onClick={saveChanges}
        >
          Save Changes
        </Button>
      </div>
      
    </div>
  )
}

export default Profile


// import { useAppStore } from "@/store";

// const Profile = () => {
//   const { userInfo } = useAppStore();

//   if (!userInfo) {
//     return <div>Loading...</div>; // Or a more appropriate loading state
//   }

//   return (
//     <div>
//       Profile
//       <div>Email: {userInfo.email}</div>
//     </div>
//   );
// };//so i am getting the problem that user get's undefined and need to have som chnages

// export default Profile;