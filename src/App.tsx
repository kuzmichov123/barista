import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Courses } from './pages/Courses'
import { Contact } from './pages/Contact'
import { CourseDetails } from './pages/CourseDetails'
import { Login } from './pages/Login'       
import { Register } from './pages/Register'
import {About} from "./pages/About" 

const App: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Router>
                <Header />
                <main className="flex-grow bg-[#F6E7D1]">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/courses/:id" element={<CourseDetails />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />         
                        <Route path="/register" element={<Register />} />   
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </div>
    )
}

export default App
