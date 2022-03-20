import { Route, Routes } from "react-router-dom"
import Elements from "./components/Elements"
import Images from "./components/Images"
import Layers from "./components/Layers"
import styles from './_sidesection.module.sass'

const SideSection = () => {
    return (
        <div className={styles.sidesection}>
            <Routes>
                <Route path="layers" element={<Layers />} />
                <Route path="elements" element={<Elements />} />
                <Route path="images" element={<Images />} />
            </Routes>
        </div>
    )
}

export default SideSection