import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Project from '../pages/project'
import UserAuth from '../auth/UserAuth'


const AppRoutes = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<UserAuth><Home/></UserAuth>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/register" element={<Register/>} />
    <Route path="/project" element={<UserAuth><Project/></UserAuth>} />
   </Routes>
   </BrowserRouter>
  )
}

export default AppRoutes
