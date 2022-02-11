import React from 'react'
import { Routes, Route } from 'react-router-dom'
import BackOffice from './Components/BackOffice/BackOffice''

export default function MainRoutes() {
    return (
            <Routes>
                <Route path="/" element={<BackOffice />}/>   
            </Routes>
    )
}