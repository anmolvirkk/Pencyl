import Details from './components/Details'
import Header from './components/Header'
import Main from './components/Main'
import styles from './_editor.module.sass'
import Layers from './components/Layers'
import { useRecoilState } from 'recoil'
import activeProjectAtom from '../activeProjectAtom'
import { Navigate, Route, Routes } from 'react-router-dom'
import projectsAtom from '../projectsAtom'
import Generate from './components/Generate'

const Editor = () => {
    const [activeProject] = useRecoilState(activeProjectAtom)
    const [projects] = useRecoilState(projectsAtom)
    let currentProject = projects.filter(i=>i.id===activeProject)[0]

    const Designer = () => {
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
    }

    if(currentProject){
        return (
            <Routes>
                <Route index element={<Designer />} />
                <Route path='generate' element={<Generate />} />
            </Routes>
        )
    }else{
        return <Navigate to='/dashboard' />
    }
}

export default Editor