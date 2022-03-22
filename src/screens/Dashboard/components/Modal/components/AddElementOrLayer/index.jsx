import { Box, Layers } from "react-feather"
import { useSetRecoilState } from "recoil"
import modalAtom from "../../modalAtom"
import styles from './_addElementOrLayer.module.sass'

const AddElementOrLayer = ({addLayer}) => {
    const setModal = useSetRecoilState(modalAtom)
    return (
        <div className={styles.wrapper}>
            <div className={styles.btn}>
                <div className={styles.content} onMouseDown={()=>setModal({type: 'addLayer', func: addLayer})}>
                    <Layers />
                    <p>Add Layer</p>
                </div>
            </div>
            <p className={styles.or}>or</p>
            <div className={styles.btn}>
                <div className={styles.content} onMouseDown={()=>setModal({type: 'addElement'})}>
                    <Box />
                    <p>Add Element</p>
                </div>
            </div>
        </div>
    )
}

export default AddElementOrLayer