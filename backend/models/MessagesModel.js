import mongoose from "mongoose";

const messageSchema =new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:false,
    },
    messageType:{
        type:String,
        enum:["text","file"],
        required:true
    },
    content:{
        type:String,
        required:function(){
            return this.message==="text"; //if file then false 
        }
    },
    fileUrl:{
        type:String,
        required:function(){
            return this.message==="file"; 
        }
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }
})

const Message=mongoose.model("Messages",messageSchema)

export default Message;
