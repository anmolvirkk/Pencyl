import { Route, Routes } from "react-router-dom"
import Layers from "./components/Layers"
import styles from './_sidesection.module.sass'

const SideSection = () => {
    return (
        <div className={styles.sidesection}>
            <Routes>
                <Route path="layers" element={<Layers />} />
            </Routes>
        </div>
    )
}

export default SideSection