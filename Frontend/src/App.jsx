import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import {Routes, Route, Navigate} from "react-router-dom"
import ChatPage from "./pages/ChatPage"
import AIChatContainer from "./pages/ImageDetect";
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore'
import AboutPage from './pages/AboutPage'
import Home from './pages/Home'


const App = () => {
 const {authUser, checkAuth, isCheckingAuth} = useAuthStore()
  const {theme}= useThemeStore()
  useEffect(()=>{
    checkAuth()
  }, [checkAuth])

  console.log({authUser})

  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>
  )

  return (
    <div data-theme={theme}>
      
      <Navbar />
      <Routes>
        <Route path='/' element={authUser? <Home  /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path='/chat' element={authUser? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/image-detection" element={<AIChatContainer />} />




      </Routes>

      <Toaster />
    </div>
  )
}

export default App