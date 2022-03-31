import { Box, Folder, Layers } from "react-feather"
import styles from './_start.module.sass'
import {useNavigate} from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from "recoil"
import modalAtom from "../../modalAtom"
import projectsAtom from "../../../../screens/projectsAtom"

const Start = () => {

    const navigate = useNavigate()
    const setModal = useSetRecoilState(modalAtom)
    const [projects, setProjects] = useRecoilState(projectsAtom)

    const startScratch = () => {
        let keyName = 'untitled'
        let num = 1
        Object.keys(projects).forEach((item)=>{
            if(item.includes('untitled')){
                num++
                keyName = 'untitled'+num
            }
        })
        setProjects({...projects, [keyName]: {}})
        navigate('editor')
        setModal({type: ''})
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.btn}>
                <div className={styles.content}>
                    <Folder />
                    <p>Upload folder</p>
                </div>
            </div>
            <p className={styles.or}>or</p>
            <div className={styles.btn} onMouseDown={startScratch}>
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