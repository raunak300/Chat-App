import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAppStore } from '@/store';
import {toast} from "sonner";
const Chat = () => {
  const { userInfo } = useAppStore(); // get user info from appstore-store and see if it is not undefined
  const navigate=useNavigate();
  useEffect(()=>{
    if(!userInfo.profileSetup){
      toast("Please setup Profile to continue");
      navigate("/profile");//redirect if not setup
    }
  },[userInfo,navigate]);
  return (
    <div>Chat</div>
  )
}

export default Chat