import {useState,useRef, useEffect} from 'react'
import {GrAttachment} from "react-icons/gr"
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerFill } from 'react-icons/ri';
import {RiEmojiStickerLine} from "react-icons/ri"
import EmojiPicker from 'emoji-picker-react'

const MessageBar = () => {
  const emojiRef=useRef(); // Create a ref to the emoji picker div which will be used to check if the click is outside of the emoji picker
  const [message, setMessage] = useState("");  //at start msg is empty
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false) 
  //this state will close and open the emoji packer

  useEffect(()=>{ //this will run when component mounts and unmounts
    //this will close the emoji picker when we click outside of it 
    function handelClickOutside(event){ //a function when clicked outside then handel it
      if(emojiRef.current && !emojiRef.current.contains(event.target)){ //if the emojiRef is not null and the target of the event is not inside the emojiRef then close the emoji picker
        //event.target is element clicked
        //emojiref is div that contains emojipicker
        //emojiref.current is current value of ref
        //ref is used to get value of div in react
        //contains is used to if target is inside div or not
        setEmojiPickerOpen(false); //close emoji picker
      }
    }
    document.addEventListener("mousedown",handelClickOutside) //this will add the event listener to the document when the component mounts
    return()=>{
      document.removeEventListener("mousedown",handelClickOutside)
    }
  },[emojiRef]) 
  //emojiRef: A ref is created using useRef(). This ref will be attached to the div that wraps the EmojiPicker component in the JSX. This allows you to access the DOM element of the emoji picker container.

  const handelAddEmoji=(emoji)=>{ //add emoji with msg
    setMessage((msg)=>msg+emoji.emoji); 
  }

  const handelSendMessage=()=>{

  }
  return (
    <div className='h-[10vh] bg-[#1c1d25] flex items-center justify-center px-8 mb-6 gap-6'>
        <div className="flex flex-1 bg-[#282b33] rounded-md items-center gap-5 pr-5 ">
            <input type="text"   //this input place for msg
            className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none ' 
            placeholder='Enter message' 
            value={message}
            onChange={(e)=>{setMessage(e.target.value)}}  //if value added then setmsg will set it
            />
            <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 hover:text-white transition-all'
            //onClick={}
            //this is file addition thing
            >
              <GrAttachment className='text-2xl opacity-05 '  />
            </button>
            <div className="relative">
              <button  className=" text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 hover:text-white transition-all "
              //in here we are using the ref to check if the click is outside of the emoji picker
              onClick={()=>setEmojiPickerOpen(true)}
              >
                <RiEmojiStickerLine className='text-2xl opacity-05' />
              </button>
              <div className='absolute bottom-16 right-0 ' ref={emojiRef} >
                {/* this is place to  */}
                <EmojiPicker 
                theme="dark"
                open={emojiPickerOpen}
                onEmojiClick={handelAddEmoji}
                autoFocusSearch={false}
                />
              </div>
            </div>
        </div> 
        <button  className=" bg-[#8417ff] flex rounded-md text-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 hover:text-white transition-all"
         onClick={handelSendMessage}
         //this will messgae to be send
         >
                <IoSend className='text-2xl opacity-05' />
        </button>
    </div>
  )
}

export default MessageBar