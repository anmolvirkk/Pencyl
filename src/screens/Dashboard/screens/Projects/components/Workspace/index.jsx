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

const Tile = ({item}) => {
    const setActiveProject = useSetRecoilState(activeProjectAtom)
    const navigate = useNavigate()
    const setProjects = useSetRecoilState(projectsAtom)
    const goToEditor = (e) => {
        if(e.target.nodeName !== 'svg'){
            setActiveProject(item.id)
            navigate('editor')
        }
    }
    const deleteProject = () => {
        fetch('http://localhost:5000/'+item.id, {
            method: 'DELETE'
        }).then(e=>e.json()).then(e=>setProjects(e))
    }
    return (
        <div className={styles.tile} onMouseDown={(e)=>goToEditor(e)}>
            <div className={styles.canvas}>
                <div className={styles.container}>
                    {JSON.parse(item.project).snapshot?<img alt='' src={JSON.parse(item.project).snapshot} />:null}
                </div>
            </div>
            <div className={styles.title}>
                <p>{JSON.parse(item.project).name}</p>
                <Trash2 onMouseDown={deleteProject} />
            </div>
        </div>
    )
}

const Workspace = () => {
    const [projects, setProjects] = useRecoilState(projectsAtom)
    const [search] = useRecoilState(searchAtom)
    useEffect(()=>{
        fetch('http://localhost:5000/', {
            method: 'GET'
        }).then((res)=>res.json()).then((data)=>{
            if(JSON.stringify(data) !== JSON.stringify(projects)){
                setProjects(data)
            }
        })
    }, [projects, setProjects])
    return (
        <div className={styles.workspace}>
            {projects.length<=0?
                <Empty />
                :
                <div className={styles.container}>
                    <div className={styles.files}>
                        {search!==''?
                            projects.map((item, key)=>{
                                return <Tile key={key} item={item} />
                            })
                            :
                            projects.map((item, key)=>{
                                return <Tile key={key} item={item} />
                            })
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Workspace