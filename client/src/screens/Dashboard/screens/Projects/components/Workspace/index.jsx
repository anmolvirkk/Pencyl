import { useEffect } from 'react'
import { Trash2 } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import modalAtom from '../../../../components/Modal/modalAtom'
import activeProjectAtom from '../../../activeProjectAtom'
import projectsAtom from '../../../projectsAtom'
import searchAtom from '../Title/searchAtom'
import styles from './_workspace.module.sass'

const Empty = () => {
    const setModal = useSetRecoilState(modalAtom)
    return (
        <div className={styles.empty}>
            <h2>Welcome to your Workspace</h2>
            <p>This is your own private space to create, edit and store your NFT Collections.</p>
            <button to='editor' onMouseDown={()=>setModal({type: 'start'})}>Create Your First NFT Project</button>
        </div>
    )
}

const Tile = ({id}) => {
    const [projects, setProjects] = useRecoilState(projectsAtom)
    const setActiveProject = useSetRecoilState(activeProjectAtom)
    const navigate = useNavigate()
    const goToEditor = (e) => {
        if(e.target.nodeName !== 'svg' && e.target.nodeName !== 'path' && e.target.nodeName !== 'line'){
            setActiveProject(id)
            navigate('editor')
        }
    }
    const deleteProject = () => {
        fetch('https://pencyl.herokuapp.com/data'+id, {
            method: 'DELETE'
        }).then(e=>e.json()).then(e=>setProjects(e))
    }
    if(projects[id]){
        return (
            <div className={styles.tile} onMouseDown={(e)=>goToEditor(e)}>
                <div className={styles.canvas}>
                    <div className={styles.container}>
                        {projects[id].snapshot?<img alt='' src={projects[id].snapshot} />:null}
                    </div>
                </div>
                <div className={styles.title}>
                    <p>{projects[id].name}</p>
                    <Trash2 onMouseDown={deleteProject} />
                </div>
            </div>
        )
    }else{
        return null
    }
}

const Workspace = () => {
    const [projects, setProjects] = useRecoilState(projectsAtom)
    const [search] = useRecoilState(searchAtom)
    useEffect(()=>{
        fetch('https://pencyl.herokuapp.com/data', {
            method: 'GET'
        }).then((res)=>res.json()).then((data)=>{
            if(JSON.stringify(data) !== JSON.stringify(projects)){
                setProjects(data)
            }
        })
    }, [projects, setProjects])
    return (
        <div className={styles.workspace}>
            {Object.keys(projects).length<=0?
                <Empty />
                :
                <div className={styles.container}>
                    <div className={styles.files}>
                        {search!==''?
                            Object.keys(projects).map((item, key)=>{
                                if(item.name.includes(search)){
                                    return <Tile key={key} id={item} />
                                }else{
                                    return null
                                }
                            })
                            :
                            Object.keys(projects).map((item, key)=>{
                                return <Tile key={key} id={item} />
                            })
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Workspace