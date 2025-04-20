import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@radix-ui/react-tooltip"
import { FaPlus } from "react-icons/fa"
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} 
from "@/components/ui/dialog"
import Lottie from "react-lottie"
import { animationDefaultOptions } from '@/lib/utils.js'
import { ScrollArea } from "@/components/ui/scroll-area"
import apiClient from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils.js";
import { useAppStore } from "@/store";

const NewDM = () => {
    const {setSelectedChatType,setSelectedChatData,setSelectedChatMessages}=useAppStore()
    const [openNewContactModel, setOpenNewContactModel] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);
    const searhContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {

                const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, { searchTerm }, { withCredentials: true })

                console.log(response.data.contacts)
                if (response.status === 200 && response.data.contacts) {//this will get the response.data.contacts as the array from the means now we get the array from the backend for user

                    setSearchedContacts(response.data.contacts);

                }
            } else {
                setSearchedContacts([]); //if no contact is there means no searchterm then we will just print it
            }
        } catch (error) {

            console.log({ error });
        }
    }
    useEffect(() => {
        console.log("searchedContacts updated in useEffect:", searchedContacts);
    }, [searchedContacts]); // This useEffect runs whenever searchedContacts changes

    const selectNewContact = async (contact) => { //this helps in on getting a contact when we get a constact we will make  setopennewcontact that to false again and searchedcontacts to null again adn we need to work on zustand store now
        setOpenNewContactModel(false);  //requires a zustand store to load current contact thing
        setSearchedContacts([])
        setSelectedChatType("contacts");
        setSelectedChatData(contact)

    }


    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => { setOpenNewContactModel(true) }} // When the icon is clicked, it calls the setOpenNewContactModel function with true, which will open the dialog.
                        />
                    </TooltipTrigger>
                    <TooltipContent
                        className="bg-[#1c1b1e] border-none mb-2 p-3 text-white rounded-md "
                    >
                        <p>Select New contact</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}
            //The prop open={openNewContactModel} on the <Dialog> component directly controls whether the dialog is visible or not based on the boolean value of the openNewContactModel state variable.
            >
                <DialogContent className=" bg-[#1c1b1e] border-none text-white w-[400px] h-[400px] flex flex-col  ">
                    <DialogHeader>
                        <DialogTitle>Message new Contacts</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>

                    </DialogHeader>
                    <div>
                        <input type="text"
                            placeholder="Search contacts..."
                            className="rounded-md p-2 w-full bg-[#2c2e3b] text-white border-none "
                            onChange={e => searhContacts(e.target.value)} //if there is user typing on the input bar then it will search on the area
                        />
                    </div>
                    {
                        searchedContacts.length>0 &&(
                            <ScrollArea className="h-[250px] ">
                        <div className="flex flex-col gap-5">
                            {
                                searchedContacts.map(contact =>
                                    <div key={contact._id}
                                        className="flex gap-3 items-center cursor-pointer"
                                        onClick={() => selectNewContact(contact)}
                                    >
                                        <div className="w-12 h-12 relative ">
                                            <Avatar className="h-13 w-13 md:w-14 md:h-14 rounded-full overflow-hidden ">
                                                {
                                                    contact.image ? (
                                                        <AvatarImage src={`${HOST}/${contact.image}`}
                                                            alt="profile"
                                                            className="object-cover w-full h-full bg-black" />
                                                    ) :
                                                        (<div className={`uppercase h-13 w-13 md:h-14 md:w-14 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                            {

                                                                contact.firstName
                                                                    ? contact.firstName.split("").shift()
                                                                    : contact.email.split("").shift()
                                                            }
                                                        </div>
                                                        )}
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col ">
                                            <span>
                                                {
                                                    contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : `${contact.email}`
                                                }
                                            </span>
                                            <span className="text-xs">
                                                {
                                                    contact.email
                                                }
                                            </span>
                                        </div>
                                    </div>)
                            }

                        </div>
                    </ScrollArea>
                        )
                    }
                    {
                        searchedContacts.length <= 0 &&
                        <div className='flex-1 bg-[#1c1b1e] lg:mt-2 md:flex flex-col justify-center items-center  duration-1000 transition-all '>
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={100}
                                width={100}
                                options={animationDefaultOptions}
                            />

                            <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300   '>
                                <h3 className='poppins-medium'>
                                    <span className='text-purple-500'>!Hi </span>Search
                                    <span className="text-purple-500"> New Contact</span>
                                </h3>

                            </div>
                        </div>

                    }
                </DialogContent>
            </Dialog>

        </>
    )
}

export default NewDM