import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import dotenv from "dotenv";
dotenv.config();

const setupSocket=(server)=> {
    const io=new SocketIoServer(server,{
        cors:{
            origin:process.env.ORIGIN,
            methods:["GET","POST"],
            credentials:true
        }
    })
    const userSocketMap=new Map(); // now to make this understand this will call all of the online user
    const disconnect =(socket)=>{
        console.log(`Client Disconnected: ${socket.id}`);
        for(const [userId,socketId] of userSocketMap.entries()){
            if(socketId===socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    const sendMessage= async(message)=>{
        const senderSocketId=userSocketMap.get(message.sender) //sender will come from frontend- user can only send when online
        const recipientSocketId=userSocketMap.get(message.recipient) //receiver is from frontend- recipient can recienve when online but if offline msg will be store in bakcned model
        const createMessage = await Message.create(message);
        const messageData=await Message.findById(createMessage._id)
        .populate("sender","id email firstName lastName image color")
        .populate("recipient","id email firstName lastName image color");  //populating and sending it to model

        if(recipientSocketId){
            io.to(recipientSocketId).emit("received message",messageData)
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("sended message",messageData);
        }

    }

   



io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId //whenever connecting to socket we will get this from user using his id from frontend

    //this line of code is extracting the value of the userId query parameter that the client sent to the server during the initial Socket.IO connection attempt.



    if(userId){
        userSocketMap.set(userId,socket.id) //if there is a user we will set the userId with socketID using map
        console.log(`user connected with userid:${userId} and socketId:${socket.id}`);
    }
    else{
        console.log("userId not provided during connection");
    }

    socket.on("sendMessage",sendMessage)

    socket.on("disconnect",()=>{
        disconnect(socket);
    })
})

}

export default setupSocket;