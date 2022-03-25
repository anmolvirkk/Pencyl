import React, { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Projects from "./screens/Projects"
import Editor from "./screens/Editor"
import { useRecoilState } from "recoil"
import modalAtom from "./components/Modal/modalAtom"
import Modal from "./components/Modal"

const Dashboard = () => {
    const [modal, setModal] = useRecoilState(modalAtom)
    useEffect(()=>{
        setModal({type: 'start'})
    }, [setModal])
    return (
        <div>
            {modal.type?<Modal />:null}
            <Routes>
                <Route index element={<Projects />} />
                <Route path="editor/*" element={<Editor />} />
            </Routes>
        </div>
    )
}

export default Dashboard