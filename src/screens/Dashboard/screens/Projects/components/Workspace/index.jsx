import { useEffect, useState } from 'react'
import { Trash2 } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import modalAtom from '../../../../components/Modal/modalAtom'
import activeProjectAtom from '../../../activeProjectAtom'
import projectsAtom from '../../../projectsAtom'
import searchAtom from '../Title/searchAtom'
import styles from './_workspace.module.sass'
import { db } from '../../../../../../firebase'
import {collection, query, onSnapshot, deleteDoc, doc} from 'firebase/firestore'
import Loader from '../../../Loading/components/Loader'
import loadingAtom from './workspaceLoadingAtom'
import workspaceLoadingAtom from './workspaceLoadingAtom'

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
    const goToEditor = (e) => {
        if(e.target.nodeName !== 'svg' && e.target.nodeName !== 'path' && e.target.nodeName !== 'line'){
            setActiveProject(item.id)
            navigate('editor')
        }
    }
    const deleteProject = () => {
        const ref = doc(db, 'projects', item.id)
        try {
            deleteDoc(ref)
        } catch (error) {
            console.log(error)  
        }
    }
    if(item){
        return (
            <div className={styles.tile} onMouseDown={(e)=>goToEditor(e)}>
                <div className={styles.canvas}>
                    <div className={styles.container}>
                        {item.data.snapshot?<img alt='' src={item.data.snapshot} />:null}
                    </div>
                </div>
                <div className={styles.title}>
                    <p>{item.data.name}</p>
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
    const [loading, setLoading] = useRecoilState(workspaceLoadingAtom)

    useEffect(()=>{
        const ref = query(collection(db, 'projects'))
        setLoading(true)
        onSnapshot(ref, snapshot => {
            let newProjects = snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))
            if(JSON.stringify(projects) !== JSON.stringify(newProjects)){
                setProjects(newProjects)
            }
            setLoading(false)
        })
    }, [projects, setProjects])

    if(loading){
        return (
            <div className={styles.loading}>
                <Loader />
            </div>
        )
    }else{
        return (
            <div className={styles.workspace}>
                {projects.length<=0?
                    <Empty />
                    :
                    <div className={styles.container}>
                        <div className={styles.files}>
                            {search!==''?
                                projects.map((item, key)=>{
                                    console.log(item)
                                    if(item.name.includes(search)){
                                        return <Tile key={key} item={item} />
                                    }else{
                                        return null
                                    }
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
}

export default Workspace