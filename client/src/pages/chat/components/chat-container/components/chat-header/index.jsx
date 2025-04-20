import React from 'react'
import { RiCloseFill } from "react-icons/ri"
import { useAppStore } from '@/store';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';


const ChatHeader = () => {

    const { closeChat, selectedChatData, selectedChatType } = useAppStore();
    return (
        <div className='h-[13vh] border-b-2 boder-[#2f303b] flex items-center justify-between px-20'>
            <div className="flex items-center gap-5 justify-between w-full">
                <div className="flex gap-6 items-center justify-center">
                    <div className="w-10 h-10 relative ">
                        <Avatar className="h-10 w-10  rounded-full overflow-hidden ">
                            {
                                selectedChatData.image ? (
                                    <AvatarImage src={`${HOST}/${selectedChatData.image}`}
                                        alt="profile"
                                        className="object-cover w-full h-full bg-black" />
                                ) :
                                    (<div className={`uppercase h-13 w-13 md:h-14 md:w-14 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                                        {

                                            selectedChatData.firstName
                                                ? selectedChatData.firstName.split("").shift()
                                                : selectedChatData.email.split("").shift()
                                        }
                                    </div>
                                    )}
                        </Avatar>
                    </div>
                   
                    <div className=''>
    {
        selectedChatType === "contact" && selectedChatData.firstName  ? (
            `${selectedChatData.firstName} ${selectedChatData.lastName}`
        ) : (
             `${selectedChatData.email}`  
        )
    }
</div>
                </div>
                <div className='flex justify-center items-center gap-5 '>
                    <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 hover:text-white transition-all'>
                        <RiCloseFill className='text-3xl'
                            onClick={closeChat}
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader
