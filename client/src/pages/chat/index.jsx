import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAppStore } from '@/store';
import {toast} from "sonner";
import ContactsContainer from './components/contacts-container';
import EmptyChatContainer from './components/empty-chat-container';
import ChatContainer from './components/chat-container';




const Chat = () => {
  const { userInfo,selectedChatType,selectedChatData } = useAppStore(); // get user info from appstore-store and see if it is not undefined
  const navigate=useNavigate();
  useEffect(()=>{
    if(!userInfo.profileSetup){
      toast("Please setup Profile to continue");
      navigate("/profile");//redirect if not setup
    }
  },[userInfo,navigate]);
  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContactsContainer />
      {
        selectedChatType===undefined ? <EmptyChatContainer /> : <ChatContainer />
      }
      {/* <EmptyChatContainer /> */}
      {/* <ChatContainer /> */}
    </div>
  )
}

export default Chat