import Details from './components/Details'
import Header from './components/Header'
import Main from './components/Main'
import styles from './_editor.module.sass'
import Layers from './components/Layers'
import { useRecoilState } from 'recoil'
import activeProjectAtom from '../activeProjectAtom'
import { Navigate } from 'react-router-dom'
import projectsAtom from '../projectsAtom'

const Editor = () => {
    const [activeProject] = useRecoilState(activeProjectAtom)
    const [projects] = useRecoilState(projectsAtom)
    let currentProject = projects.filter(i=>i.id===activeProject)[0]
    if(currentProject){
        return (
            <div className={styles.editor}>
                <Header />
                <div className={styles.mainsection}>
                    <Layers currentProject={currentProject} />
                    <Main currentProject={currentProject} />
                    <Details currentProject={currentProject} />
                </div>
            </div>
        )
    }else{
        return <Navigate to='/dashboard' />
    }
}

export default Editor