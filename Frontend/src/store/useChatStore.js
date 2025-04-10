// filepath: Frontend/src/store/useChatStore.js
import {create} from 'zustand'
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios.js"
import {useAuthStore} from "./useAuthStore";

export const useChatStore= create ((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/api/messages/users");
            set({ users: res.data });
        } catch (error) {
            console.log("Error in getting users", error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/api/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            console.log("Error in getting messages", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            let res;
            if (selectedUser === "AI") {
                res = await axiosInstance.post(`/api/ai/generate`, messageData);
                set({ messages: [...messages, { ...messageData, senderId: "user" }, res.data] });
            } else {
                res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData);
                set({ messages: [...messages, res.data] });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            if (error.code === "ERR_BAD_REQUEST" && error.response?.status === 413) {
                toast.error("Image size is too large");
            } else {
                toast.error(error.response?.data?.message || "Failed to send message");
            }
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get()
        if (!selectedUser) return;
        

        const socket = useAuthStore.getState().socket

        
        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            
            set({ 
                messages: [...get().messages, newMessage],

             });
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        if(!socket) return

        socket.off("newMessage")
    },


    setSelectedUser: (selectedUser) => {
        if (selectedUser === "AI") {
            set({ selectedUser: "AI" });
        } else {
            set({ selectedUser });
        }
    },
}))