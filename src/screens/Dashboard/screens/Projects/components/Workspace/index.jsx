import { useNavigate } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import modalAtom from '../../../../components/Modal/modalAtom'
import MoreMenu from '../../../../components/MoreMenu'
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
    const navigate = useNavigate()
    const goToEditor = () => {
        setProjects({...projects, active: id})
        navigate('editor')
    }
    return (
        <div className={styles.tile} onMouseDown={goToEditor}>
            <div className={styles.canvas}>
                <div className={styles.container}>
                    {projects&&projects[id]&&projects[id].snapshot?<img alt='' src={projects[id].snapshot} />:null}
                </div>
            </div>
            <div className={styles.title}>
                <p>{projects[id].name}</p>
                <MoreMenu options={[{name: 'edit', func: ()=>{}},{name: 'delete', func: ()=>{}}]} />
            </div>
        </div>
    )
}

const Workspace = () => {
    const [projects] = useRecoilState(projectsAtom)
    const [search] = useRecoilState(searchAtom)
    return (
        <div className={styles.workspace}>
            {Object.keys(projects).length<=0?
                <Empty />
                :
                <div className={styles.container}>
                    <div className={styles.files}>
                        {search!==''?
                            Object.keys(projects).map((item, key)=>{
                                if(projects[item].name){
                                    if(item!=='active' && projects[item].name.includes(search)){
                                        return <Tile key={key} id={item} />
                                    }else{
                                        return null
                                    }
                                }else{
                                    return null
                                }
                            })
                            :
                            Object.keys(projects).map((item, key)=>{
                                if(item!=='active'){
                                    return <Tile key={key} id={item} />
                                }else{
                                    return null
                                }
                        })}
                    </div>
                </div>
            }
        </div>
    )
}

export default Workspace