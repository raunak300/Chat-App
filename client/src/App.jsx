import React from "react"
import { BrowserRouter ,Route ,Routes,Navigate } from "react-router-dom"
import Auth from "./pages/auth"
import Profile from "./pages/profile"
import Chat from "./pages/chat"
 
function App() {
  return (
    <BrowserRouter>

      <Routes>
         
        <Route path="/auth" element = {<Auth />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="*" element={<Navigate to="/auth" />} />

      </Routes>

    </BrowserRouter>
  )
} 

export default App
