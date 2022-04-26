import { Box, Folder, Layers } from "react-feather"
import styles from './_start.module.sass'
import {useNavigate} from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from "recoil"
import modalAtom from "../../modalAtom"
import projectsAtom from "../../../../screens/projectsAtom"
import activeProjectAtom from "../../../../screens/activeProjectAtom"

const Start = () => {

    const navigate = useNavigate()
    const setModal = useSetRecoilState(modalAtom)
    const [projects, setProjects] = useRecoilState(projectsAtom)
    const setActiveProject = useSetRecoilState(activeProjectAtom)

    const startScratch = () => {
        let id = new Date().valueOf().toString()
        const project = {
            name: 'untitled',
            canvas: {
                height: 600,
                width: 600,
                background: '#090909'
            },
            layers: {}
        }
        fetch('http://localhost:5000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id, project: project})
        }).then((res)=>res.json()).then((data)=>{
            setActiveProject(id)
            setProjects(data)
            navigate('editor')
            setModal({type: ''})
        })
    }

    const startDemo = () => {
        let id = new Date().valueOf().toString()
        const project = {
            name: 'untitled',
            canvas: {
                height: 600,
                width: 600,
                background: '#090909'
            },
            layers: {}
        }
        fetch('http://localhost:5000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id, project: project})
        }).then((res)=>res.json()).then((data)=>{
            setActiveProject(id)
            setProjects(data)
            navigate('editor')
            setModal({type: ''})
        })
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
            <div className={styles.btn} onMouseDown={startDemo}>
                <div className={styles.content}>
                    <Layers />
                    <p>Open Demo</p>
                </div>
            </div>
        </div>
    )
}

export default Start