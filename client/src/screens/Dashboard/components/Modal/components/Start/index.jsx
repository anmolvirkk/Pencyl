import { Box, Folder, Layers } from "react-feather"
import styles from './_start.module.sass'
import {useNavigate} from 'react-router-dom'
import { useSetRecoilState } from "recoil"
import modalAtom from "../../modalAtom"
import activeProjectAtom from "../../../../screens/activeProjectAtom"
import layersJSON from './layers.json'
import { db } from "../../../../../../firebase"
import {collection, addDoc} from 'firebase/firestore'

const Start = ({setLoading}) => {

    const navigate = useNavigate()
    const setModal = useSetRecoilState(modalAtom)
    const setActiveProject = useSetRecoilState(activeProjectAtom)

    const startScratch = () => {
        const project = {
            name: 'untitled',
            canvas: {
                height: 600,
                width: 600,
                background: '#090909'
            },
            layers: {}
        }
        addDoc(collection(db, 'projects'), {
            ...project
        }).then((e)=>{
            setActiveProject(e.id)
            navigate('editor')
            setModal({type: ''})
        })
    }

    const startFolder = (e) => {
        setLoading(true)
        let name = e.target.files[0].webkitRelativePath.split('/')[0]
        let layers = {}
        let maxHeight = 0
        let maxWidth = 0
        let activeLayerAssets = {}
        for(let i = 0;  i < e.target.files.length; i++){
            let tempImg = new Image()
            tempImg.src = `/${e.target.files[i].webkitRelativePath}`
            tempImg.onload = () => afterLoad(tempImg.height, tempImg.width, i)
        }
        const afterLoad = (height, width, i) => {
            if(height > maxHeight){
                maxHeight = height
            }
            if(width > maxWidth){
                maxWidth = width
            }
            let path = e.target.files[i].webkitRelativePath.split('/')
            path.splice(0, 1)
            let active = false
            if(!activeLayerAssets[path[0]]){
                activeLayerAssets[path[0]] = true
                active = true
            }
            let layer = {
                active: active,
                elem: `/${e.target.files[i].webkitRelativePath}`,
                id: new Date().valueOf().toString()+i,
                rare: '',
                style: {
                    width: 'auto',
                    height: 'auto',
                    lockAspectRatio: true,
                    top: '0%', 
                    left: '0%',
                    rotate: '0deg',
                    brightness: '100%',
                    contrast: '100%',
                    saturatation: '100%',
                    hue: '0deg',
                    sepia: '0%'
                }
            }
            layers[path[0]] = {active: false, assets: layers[path[0]]&&layers[path[0]].assets?[...layers[path[0]].assets, layer]:[layer]}
            if(i === e.target.files.length-1){
                let newKeys = Object.keys(layers)
                newKeys.sort()
                let newLayers = {}
                for(let i = 0; i < newKeys.length; i++){
                    newLayers[newKeys[i]] = layers[newKeys[i]]
                    newLayers[newKeys[i]].index = i
                    if(i === newKeys.length - 1){
                        const project = {
                            name: name,
                            canvas: {
                                height: maxHeight,
                                width: maxWidth,
                                background: '#090909'
                            },
                            layers: newLayers,
                            snapshot: ''
                        }
                        addDoc(collection(db, 'projects'), {
                            ...project
                        }).then((e)=>{
                            setLoading(false)
                            setActiveProject(e.id)
                            navigate('editor')
                            setModal({type: ''})
                        })
                    }
                }
            }
        }
    }

    const startDemo = () => {
        setLoading(true)
        const project = {
            name: 'demo',
            canvas: {
                height: 1000,
                width: 1000,
                background: '#090909'
            },
            layers: layersJSON,
            snapshot: ''
        }
        addDoc(collection(db, 'projects'), {
            ...project
        }).then((e)=>{
            setLoading(false)
            setActiveProject(e.id)
            navigate('editor')
            setModal({type: ''})
        })
    }

    return (
        <div className={styles.wrapper}>
            <label>
                <div className={styles.btn}>
                    <div className={styles.content}>
                        <Folder />
                        <p>Upload folder</p>
                    </div>
                </div>
                <input directory="/public" webkitdirectory="/public" type="file" onChange={startFolder} />
            </label>
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