import { Routes, Route } from "react-router-dom"
import Projects from "./screens/Projects"
import Editor from "./screens/Editor"
import { useRecoilState } from "recoil"
import modalAtom from "./components/Modal/modalAtom"
import Modal from "./components/Modal"
import loadingAtom from "./screens/loadingAtom"
import Loading from "./screens/Loading"

const Dashboard = () => {
    const [modal] = useRecoilState(modalAtom)
    const [loading] = useRecoilState(loadingAtom)
    return (
        <div>
            {loading?<Loading />:null}
            {modal.type?<Modal />:null}
            <Routes>
                <Route index element={<Projects />} />
                <Route path={`editor/*`} element={<Editor />} />
            </Routes>
        </div>
    )
}

export default Dashboard