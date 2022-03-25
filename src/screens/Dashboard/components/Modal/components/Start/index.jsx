import { Box, Folder, Layers } from "react-feather"
import styles from './_start.module.sass'

const Start = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.btn}>
                <div className={styles.content}>
                    <Folder />
                    <p>Use folder</p>
                </div>
            </div>
            <p className={styles.or}>or</p>
            <div className={styles.btn}>
                <div className={styles.content}>
                    <Box />
                    <p>Start from scratch</p>
                </div>
            </div>
            <p className={styles.or}>or</p>
            <div className={styles.btn}>
                <div className={styles.content}>
                    <Layers />
                    <p>Open Demo</p>
                </div>
            </div>
        </div>
    )
}

export default Start