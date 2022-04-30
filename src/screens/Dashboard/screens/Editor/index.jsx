import Details from './components/Details'
import Header from './components/Header'
import Main from './components/Main'
import styles from './_editor.module.sass'
import Layers from './components/Layers'
import { useRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import activeProjectAtom from '../activeProjectAtom'
import projectsAtom from '../projectsAtom'

const Editor = () => {
    const [activeProject] = useRecoilState(activeProjectAtom)
    const [projects] = useRecoilState(projectsAtom)
    const navigate = useNavigate()
    useEffect(()=>{
        if(!activeProject || !projects.filter(i=>i.id===activeProject)[0].project){
            navigate('/dashboard')
        }
    }, [navigate, activeProject, projects])

    if(activeProject){
        return (
            <div className={styles.editor}>
                <Header />
                <div className={styles.mainsection}>
                    <Layers />
                    <Main />
                    <Details />
                </div>
            </div>
        )
    }else{
        return null
    }
}

export default Editor