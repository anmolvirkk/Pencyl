import { Box, Folder, Layers } from "react-feather"
import styles from './_start.module.sass'
import {useNavigate} from 'react-router-dom'
import { useSetRecoilState } from "recoil"
import modalAtom from "../../modalAtom"
import projectsAtom from "../../../../screens/projectsAtom"
import activeProjectAtom from "../../../../screens/activeProjectAtom"
import { useState } from "react"
import loadingData from '../../../../loading.json'
import Lottie from "react-lottie-player"

const Start = () => {

    const navigate = useNavigate()
    const setModal = useSetRecoilState(modalAtom)
    const setActiveProject = useSetRecoilState(activeProjectAtom)
    const setProjects = useSetRecoilState(projectsAtom)

    const startScratch = () => {
        let id = new Date().valueOf().toString()
        const project = {
            name: 'untitled',
            canvas: {
                height: 600,
                width: 600,
                background: '#090909'
            },
            layers: {}
        }
        fetch('http://localhost:5000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id, project: project})
        }).then((res)=>res.json()).then((data)=>{
            setActiveProject(id)
            setProjects(data)
            navigate('editor')
            setModal({type: ''})
        })
    }

    const [loading, setLoading] = useState(false)

    const startFolder = (e) => {
        setLoading(true)
        let name = e.target.files[0].webkitRelativePath.split('/')[0]
        let layers = {}
        let prev = null
        let maxHeight = 0
        let maxWidth = 0
        for(let i = 0; i < e.target.files.length; i++){
            let tempImg = new Image()
            tempImg.src = `/${e.target.files[i].webkitRelativePath}`
            if(tempImg.height > maxHeight){
                maxHeight = tempImg.height
            }
            if(tempImg.width > maxWidth){
                maxWidth = tempImg.width
            }
            let path = e.target.files[i].webkitRelativePath.split('/')
            path.splice(0, 1)
            let active = false
            if(prev!==path[0]){
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
            prev = path[0]
            layers[path[0]] = {active: false, assets: layers[path[0]]&&layers[path[0]].assets?[...layers[path[0]].assets, layer]:[layer]}
            if(i === e.target.files.length-1){
                let newKeys = Object.keys(layers)
                newKeys.sort()
                let newLayers = {}
                for(let i = 0; i < newKeys.length; i++){
                    newLayers[newKeys[i]] = layers[newKeys[i]]
                    if(i === newKeys.length - 1){const project = {
                        name: name,
                        canvas: {
                            height: maxHeight,
                            width: maxWidth,
                            background: '#090909'
                        },
                        layers: newLayers,
                        snapshot: ''
                    }
                    let id = new Date().valueOf().toString()
                    let body = JSON.stringify({id: id, project: project})
                    fetch('http://localhost:5000/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: body
                    }).then((res)=>res.json()).then((data)=>{
                        setLoading(false)
                        if(data.message){
                            setModal({type: 'error', text: data.message})
                        }else{
                            setActiveProject(id)
                            setProjects(data)
                            navigate('editor')
                            setModal({type: ''})
                        }
                    })
                    }
                }
            }
        }
    }

    if(loading){
        return (
            <div className={styles.loading}>
                <Lottie
                    loop
                    animationData={loadingData}
                    play
                    style={{ width: 150, height: 150 }}
                />
            </div>
        )
    }else{
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
                <label>
                    <div className={styles.btn}>
                        <div className={styles.content}>
                            <Layers />
                            <p>Open Demo</p>
                        </div>
                    </div>
                    <input directory="/public" webkitdirectory="/public" type="file" onChange={e=>console.log(e)} />
                </label>
            </div>
        )
    }
}

export default Start