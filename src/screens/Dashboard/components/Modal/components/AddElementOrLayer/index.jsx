import { Box, Layers } from "react-feather"
import styles from './_addElementOrLayer.module.sass'

const AddElementOrLayer = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.btn}>
                <div className={styles.content}>
                    <Layers />
                    <p>Add Layer</p>
                </div>
            </div>
            <p className={styles.or}>or</p>
            <div className={styles.btn}>
                <div className={styles.content}>
                    <Box />
                    <p>Add Element</p>
                </div>
            </div>
        </div>
    )
}

export default AddElementOrLayer