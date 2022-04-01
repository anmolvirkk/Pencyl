import Details from './components/Details'
import Header from './components/Header'
import Main from './components/Main'
import styles from './_editor.module.sass'
import Layers from './components/Layers'
import { useRecoilState } from 'recoil'
import projectsAtom from '../projectsAtom'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Editor = () => {
    const [projects] = useRecoilState(projectsAtom)
    const navigate = useNavigate()
    useEffect(()=>{
        if(!projects.active){
            navigate('/dashboard')
        }
    }, [navigate, projects.active])
    if(projects.active){
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