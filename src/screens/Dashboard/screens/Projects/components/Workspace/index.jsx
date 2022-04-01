import { useRecoilState, useSetRecoilState } from 'recoil'
import modalAtom from '../../../../components/Modal/modalAtom'
import MoreMenu from '../../../../components/MoreMenu'
import projectsAtom from '../../../projectsAtom'
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

const Tile = ({title}) => {
    return (
        <div className={styles.tile}>
            <div className={styles.canvas}>
                <div className={styles.container}></div>
            </div>
            <div className={styles.title}>
                <p>{title}</p>
                <MoreMenu options={[{name: 'edit', func: ()=>{}},{name: 'delete', func: ()=>{}}]} />
            </div>
        </div>
    )
}

const Workspace = () => {
    const [projects] = useRecoilState(projectsAtom)
    return (
        <div className={styles.workspace}>
            {Object.keys(projects).length<=0?
                <Empty />
                :
                <div className={styles.container}>
                    <div className={styles.files}>
                        {Object.keys(projects).map((item, key)=><Tile key={key} title={item} />)}
                    </div>
                </div>
            }
        </div>
    )
}

export default Workspace