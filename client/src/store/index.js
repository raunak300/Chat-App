import { create } from "zustand";
import {createAuthSlice} from "./slice/auth-slice"
import { persist } from "zustand/middleware";
import { createChatSlice } from "./slice/chat-slice";

export const useAppStore= create()((...a)=>({
    //we can use this useAppStore and can use set and get method in any part of our website
    ...createAuthSlice(...a),
    ...createChatSlice(...a)
}))