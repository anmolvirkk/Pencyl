import { Box, Folder, Layers } from "react-feather"
import styles from './_start.module.sass'
import {useNavigate} from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from "recoil"
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
        const convertToBase64 = async (url) => {
            const data = await fetch(url)
            const blob = await data.blob()
            return new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                const base64data = reader.result
                resolve(base64data)
            }
            })
        }
        let layers = {}
        let name = e.target.files[0].webkitRelativePath.split('/')[0]
        let prev = null
        let tempImg = new Image()
        tempImg.src = `/${e.target.files[0].webkitRelativePath}`
        const setLayers = async () => {
            for(let i = 0; i < e.target.files.length; i++){
                let path = e.target.files[i].webkitRelativePath.split('/')
                path.splice(0, 1)
                let active = false
                if(prev!==path[0]){
                    active = true
                }
                let layer = {
                    active: active,
                    elem: convertToBase64(e.target.files[i].webkitRelativePath),
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
            }
        }
        setLayers().then(()=>{
            for(let i = 0; i < Object.keys(layers).length; i++){
                for(let j = 0; j < layers[Object.keys(layers)[i]].assets.length; j++){
                    Promise.resolve(layers[Object.keys(layers)[i]].assets[j].elem).then(e=>{
                        layers[Object.keys(layers)[i]].assets[j].elem = e
                        if(i === (Object.keys(layers).length - 1) && j === (layers[Object.keys(layers)[i]].assets.length - 1)){
                            let newKeys = Object.keys(layers)
                            newKeys.sort()
                            let newLayers = {}
                            for(let i = 0; i < newKeys.length; i++){
                                newLayers[newKeys[i]] = layers[newKeys[i]]
                                if(i === newKeys.length - 1){
                                    setTimeout(()=>{
                                        const project = {
                                            name: name,
                                            canvas: {
                                                height: tempImg.height,
                                                width: tempImg.width,
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
                                    }, 100)
                                }
                            }
                        }
                    })
                }
            }
        })
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