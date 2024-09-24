import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import {Header} from './components/Header'
import {Footer} from './components/Footer'
import {Home} from './pages/Home'
import {Courses} from './pages/Courses'
import {Contact} from './pages/Contact'
import {CourseDetails} from './pages/CourseDetails'

const App: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Router>
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/courses/:id" element={<CourseDetails />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </div>
    )
}

export default App
