import { Plus } from 'react-feather'
import { useRecoilState, useSetRecoilState } from 'recoil'
import modalAtom from '../../../../components/Modal/modalAtom'
import MoreMenu from '../../../../components/MoreMenu'
import projectsAtom from '../../../projectsAtom'
import styles from './_layers.module.sass'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import targetAtom from '../Main/targetAtom'
import activeProjectAtom from '../../../activeProjectAtom'
import React, { useCallback } from 'react'

const AddLayer = React.memo(({currentProject}) => {
    
    const setModal = useSetRecoilState(modalAtom)
    const setProjects = useSetRecoilState(projectsAtom)
    const [activeProject] = useRecoilState(activeProjectAtom)
    
    let layers = currentProject.layers

    const project = currentProject
    
    const addLayer = (layerName) => { 
        let shouldAddLayer = true

        Object.keys(project.layers).forEach((item)=>{
            if(item === layerName.toLowerCase().replaceAll(/\s/g,'')){
                shouldAddLayer = false
            }
        })

        if(shouldAddLayer){
            if(layerName !== ''){
                if(isNaN(layerName.toLowerCase().replaceAll(/\s/g,'').charAt(0))){
                    let projectString = JSON.stringify(project)
                    let newProject = JSON.parse(projectString)
                    newProject.layers = {...layers, [layerName.toLowerCase().replaceAll(/\s/g,'')]: {}}
                    fetch('http://localhost:5000/'+activeProject, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newProject)
                    }).then(e=>e.json()).then((e)=>{
                        setProjects(e)
                        setModal({type: null})
                    })
                }else{
                    setModal({type: 'addLayer', func: addLayer, error: 'Layer name cannot start with a number'})
                }
            }else{
                setModal({type: 'addLayer', func: addLayer, error: 'Layer name cannot be empty'})
            }
        }else{
            setModal({type: 'addLayer', func: addLayer, error: 'Layer name taken'})
        }
    }
    return (
        <div className={styles.addLayer} onMouseDown={()=>setModal({type: 'addLayer', func: addLayer})}>
            <div className={styles.wrapper}>
                <Plus />
                <p>Add Layer</p>
            </div>
        </div>
    )
})

const Layer = React.memo(({name, currentProject}) => {

    const setProjects = useSetRecoilState(projectsAtom)
    const [activeProject] = useRecoilState(activeProjectAtom)
    const project = currentProject
    let layers = currentProject.layers

    const setLayers = useCallback((layers) => {
        let projectString = JSON.stringify(project)
        let newProject = JSON.parse(projectString)
        newProject.layers = {...layers}
        fetch('http://localhost:5000/'+activeProject, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProject)
        }).then(e=>e.json()).then(e=>setProjects(e))
    }, [])

    const setModal = useSetRecoilState(modalAtom)
                
    const convertToBase64 = useCallback(async (url) => {
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
    }, [])

    const Title = React.memo(() => {
        const [activeProject] = useRecoilState(activeProjectAtom)
        if(name){
            const removeLayer = useCallback(() => {
                let newLayers = {}
                Object.keys(layers).forEach((item)=>{
                    if(item !== name){
                        newLayers = {...newLayers, [item]: layers[item]}
                    }
                })
                let projectString = JSON.stringify(project)
                let newProject = JSON.parse(projectString)
                newProject.layers = {...newLayers}
                fetch('http://localhost:5000/'+activeProject, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newProject)
                }).then(e=>e.json()).then((e)=>{
                    setProjects(e)
                    setModal({type: null})
                })
            }, [])

            const addElement = useCallback((e) => {
                let link = e.target.src.replace('png-64','png-512')
                convertToBase64(link).then((e)=>{
                    let assetId = new Date().valueOf()
                    Object.keys(project.layers).forEach((item)=>{
                        if(project.layers[item]['active']){
                            if(item === name){
                                project.layers[item]['active'] = true
                            }else{
                                project.layers[item]['active'] = false
                            }
                        }
                    })
                    let layerStyle = {
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
                    if(project.layers[name]&&project.layers[name]['assets']){
                            let resetActiveAssets = project.layers[name]['assets'].map((item)=>{
                                let newItem = {...item}
                                newItem.active = false
                                return newItem
                            })
                            let projectString = JSON.stringify(project)
                            let newProject = JSON.parse(projectString)
                            newProject.layers[name]['assets'] = [...resetActiveAssets, {
                                elem: e,
                                rare: '',
                                active: true,
                                id: assetId,
                                style: layerStyle
                            }]
                            const [projects] = useRecoilState(projectsAtom)
                            let newProjects = projects
                            newProject[newProject.id] = newProject
                            setProjects(newProjects)
                            fetch('http://localhost:5000/'+activeProject, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(newProject)
                            })
                    }else{
                        let projectString = JSON.stringify(project)
                        let newProject = JSON.parse(projectString)
                        newProject.layers[name]['assets'] = [{
                            elem: e,
                            rare: '',
                            active: true,
                            id: assetId,
                            style: layerStyle
                        }]
                        fetch('http://localhost:5000/'+activeProject, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(newProject)
                        }).then(e=>e.json()).then((e)=>{
                            setProjects(e)
                        })
                    }
                    setModal({type: null})
                })
            }, [])
            const editLayerModal = useCallback(() => {
                const editLayer = (newName) => {
                    let projectString = JSON.stringify(project)
                    let newProject = JSON.parse(projectString)
                    let newLayers = {}
                    let rename = true
                    Object.keys(project.layers).forEach((item)=>{
                        let newItem = item
                        if(item === name){
                            Object.keys(project.layers).forEach((item)=>{
                                if(item === newName){
                                    rename = false
                                }
                            })
                            if(rename){
                                if(newName !== ''){
                                    if(isNaN(newName.toLowerCase().replaceAll(/\s/g,'').charAt(0))){
                                        newItem = newName
                                    }else{
                                        setModal({type: 'addLayer', func: editLayer, error: 'Layer name cannot start with a number'})
                                    }
                                }else{
                                    setModal({type: 'addLayer', func: editLayer, error: 'Layer name cannot be empty'})
                                }
                            }else{
                                setModal({type: 'editLayer', func: editLayer, error: 'Layer name taken'})
                            }
                        }
                        newLayers = {...newLayers, [newItem]: project.layers[item]}
                    })
                    newProject.layers = newLayers
                    fetch('http://localhost:5000/'+activeProject, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(newProject)
                    }).then(e=>e.json()).then(e=>setProjects(e))
                    if(rename && isNaN(newName.toLowerCase().replaceAll(/\s/g,'').charAt(0))){
                        setModal({type: null})
                    }
                }
                setModal({type: 'editLayer', func: editLayer})
            }, [])
            return (
                <div className={styles.layerbtn}>
                    <p>{name}</p>
                    <div className={styles.options}>
                        <div className={styles.addBtn}>
                            <Plus onMouseDown={()=>setModal({type: 'addElement', func: addElement})} />
                        </div>
                        <MoreMenu options={[{name: 'edit', func: editLayerModal},{name: 'delete', func: removeLayer}]} />
                    </div>
                </div>
            )
        }else{
            return null
        }
    })
    
    const Assets = React.memo(() => {
        const [target, setTarget] = useRecoilState(targetAtom)
    
        let targets = []
    
        if(target){
            let reverseLayerKey = Object.keys(layers).reverse()
            if(!Array.isArray(target)){
                let index = parseInt(target.id.split('-')[1])
                targets = reverseLayerKey[index]
            }else{
                target.forEach((item)=>{
                    let index = parseInt(item.id.split('-')[1])
                    targets = [...targets, reverseLayerKey[index]]
                })
            }
        }

        let isActive = false

        if(!Array.isArray(target)){
            if(name === targets){
                isActive = true
            }
        }else{
            targets.forEach((item)=>{
                if(name === item){
                    isActive = true
                }
            })
        }

        const setActiveTarget = useCallback((i) => {
            let asset = document.getElementById('asset-'+i)
            if(target){
                if(!target.includes(asset)){
                    setTarget([...target, asset])
                }
            }else{
                setTarget([asset])
            }
        }, [])
        const setActiveAsset = useCallback((asset, e) => {
            let isMoreMenu = e.target.className && typeof e.target.className === 'string' && e.target.className.split('_').indexOf('moremenu') > 0
            if(e.target.tagName !== 'svg' && !isMoreMenu){
                let layersString = JSON.stringify(layers)
                let layersParse = JSON.parse(layersString)
                let layerString = JSON.stringify(layers[name])
                let layerParse = JSON.parse(layerString)
                let reverseLayerKey = Object.keys(layersParse).reverse()
                reverseLayerKey.forEach((item, i)=>{
                    if(item === name){
                        layersParse[item].active = true
                        setActiveTarget(i)
                    }else{
                        layersParse[item].active = false
                    }
                })
                layerParse.assets = layerParse.assets.map((item)=>{
                    let newItem = {...item}
                    if(item.id === asset.id){
                        newItem.active = true
                    }else{
                        newItem.active = false
                    }
                    return newItem
                })
                layersParse[name] = {...layerParse}
                setLayers({...layersParse})
            }
        }, [])
        const deleteAsset = useCallback((item) => {
            let assetRemoved = layers[name]['assets'].filter(i=>i.id!==item.id)
            assetRemoved = assetRemoved.map((item, i)=>{
                let newItem = {...item}
                if(i === 0){
                    newItem.active = true
                }else{
                    newItem.active = false
                }
                return newItem
            })
            if(assetRemoved.length > 0){
                setLayers({...layers, [name]: {...layers[name], assets: assetRemoved, active: false}})
            }else{
                setLayers({...layers, [name]: {...layers[name], assets: null, active: false}})
            }
        }, [])

        const changeAsset = useCallback((item) => {
            const editElement = (e) => {
                convertToBase64(e.target.src).then((e)=>{
                    let layersString = JSON.stringify(layers)
                    let layersParse = JSON.parse(layersString)
                    layersParse[name]['assets'] = layersParse[name]['assets'].map((item2)=>{
                        let newItem = {...item2}
                        if(item.id === item2.id){
                            newItem = {...item2,
                                elem: e
                            }
                        }
                        return newItem
                    })
                    setLayers({...layersParse})
                    setModal({type: null})
                })
            }
            setModal({type: 'editElement', func: editElement})
        }, [])
        if(layers[name]&&layers[name]['assets']){
            return (
                <div className={styles.assets}>
                    {layers[name]['assets'].map((item, key)=>
                        <div onMouseDown={(e)=>setActiveAsset(item, e)} className={item.active?isActive?`${styles.item} ${styles.active} ${styles.highlight}`:`${styles.item} ${styles.active}`:styles.item} key={key}>
                            <img src={item.elem} alt='' />
                            <MoreMenu options={[{name: 'change', func: ()=>changeAsset(item)},{name: 'delete', func: ()=>{deleteAsset(item)}}]} />
                        </div>)
                    }
                </div>
            )
        }else{
            return null
        }
    })

    return (
        <div className={styles.layer}>
            <Title />
            <Assets />
        </div>
    )

})

const Layers = React.memo(() => {

    const [projects, setProjects] = useRecoilState(projectsAtom)
    const [activeProject] = useRecoilState(activeProjectAtom)
    let currentProject = projects[activeProject]

    if(currentProject){

        let layers = currentProject.layers
        const project = currentProject
    
        const reorderLayers = useCallback((e) => {
            let projectString = JSON.stringify(project)
            let newProject = JSON.parse(projectString)
            let newLayers = newProject.layers
            let newLayersKeys = Object.keys(newLayers)
            newLayersKeys.splice(e.destination.index, 0, newLayersKeys.splice(e.source.index, 1)[0])
            let finalLayers = {}
            newLayersKeys.forEach((item)=>{
                finalLayers = {...finalLayers, [item]: newLayers[item]}
            })
            newProject.layers = finalLayers
            let projectsString = JSON.stringify(projects)
            let newProjects = JSON.parse(projectsString)
            newProjects[newProject.id] = newProject
            setProjects(newProjects)
            fetch('http://localhost:5000/'+activeProject, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newProject)
            })
        }, [])
    
        return (
            <div className={styles.layersWrapper}>
                <DragDropContext onDragEnd={(e)=>reorderLayers(e)}>
                    <Droppable droppableId='droppable-1'>
                        {(provided)=>(
                            <div className={styles.layers} ref={provided.innerRef} {...provided.droppableProps}>
                                {Object.keys(layers).map((item, i)=>(
                                    <Draggable key={i} draggableId={`draggable-${i}`} index={i}>
                                        {(provided)=>(
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <Layer name={item} currentProject={currentProject} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <AddLayer currentProject={currentProject} />
            </div>
        )
        
    }else{
        return null
    }

})

export default Layers