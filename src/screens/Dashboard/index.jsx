import React from "react"
import { Routes, Route } from "react-router-dom"
import Projects from "./screens/Projects"
import Editor from "./screens/Editor"

const Dashboard = () => {
    return (
        <Routes>
            <Route index element={<Projects />} />
            <Route path="editor/*" element={<Editor />} />
        </Routes>
    )
}

export default Dashboard