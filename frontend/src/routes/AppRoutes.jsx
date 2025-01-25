import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Project from '../pages/project'


const AppRoutes = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/register" element={<Register/>} />
    <Route path="/project" element={<Project/>} />
   </Routes>
   </BrowserRouter>
  )
}

export default AppRoutes
