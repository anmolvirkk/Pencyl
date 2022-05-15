import { useRecoilState, useSetRecoilState } from 'recoil'
import styles from './_main.module.sass'
import { useCallback, useEffect, useRef, useState } from 'react'
import projectsAtom from '../../../projectsAtom'
import Moveable from 'react-moveable'
import targetAtom from './targetAtom'
import Selecto from "react-selecto"
import { toJpeg } from 'dom-to-image'
import activeProjectAtom from '../../../activeProjectAtom'
import { Navigate } from 'react-router-dom'
import { db } from '../../../../../../firebase'
import { doc, updateDoc } from 'firebase/firestore'

const Main = () => {

    const setProjects = useSetRecoilState(projectsAtom)

    const [activeProject] = useRecoilState(activeProjectAtom)
    const [projects] = useRecoilState(projectsAtom)
    let currentProject = projects.filter(i=>i.id===activeProject)[0]

    if(currentProject){

        const layers = currentProject.data.layers

        const project = currentProject.data
    
        const setSnapshot = () => {
            if(document.getElementById('canvasWrapper')){
                let canvas = document.getElementById('canvasWrapper')
                toJpeg(canvas).then((e)=>{
                    if(e !== 'data:,'){
                        let newProject = {...project, snapshot: e}
                        updateDoc(doc(db, 'projects', activeProject), {
                            ...newProject
                        })
                    }
                })
            }
        }
    
        if(document.getElementById('canvas')){
            document.getElementById('canvas').onmouseleave = () => {
                setSnapshot()
            }
        }
    
        const setLayers = useCallback((layers) => {
            let projectString = JSON.stringify(project)
            let newProject = JSON.parse(projectString)
            newProject.layers = {...layers}
            updateDoc(doc(db, 'projects', activeProject), {
                ...newProject
            })
        }, [setProjects, activeProject, project])
    
        let onChange = useRef(null)
    
        useEffect(()=>{
            if(Object.keys(layers).length > 0){
                Object.keys(layers).forEach((item)=>{
                    if(layers[item].active){
                        if(Object.keys(layers[item]).length > 0 && layers[item]['assets']){
                            layers[item]['assets'].forEach((item2, i)=>{
                                if(item2.active){
                                    onChange.current = (key, value) => {
                                        let layersString = JSON.stringify(layers)
                                        let newLayers = JSON.parse(layersString)
                                        newLayers[item]['assets'][i].style[key] = value+'%'
                                        setLayers({...newLayers})
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }, [layers, setLayers])
        
        const [canvasSize, setCanvasSize] = useState(null)
    
        const setCanvas = useCallback(() => {
            if(document.getElementById('canvas')){
                if(!canvasSize){
                    setCanvasSize({
                        height: document.getElementById('canvas').clientHeight,
                        width: document.getElementById('canvas').clientWidth
                    })
                }else if(canvasSize.height !== document.getElementById('canvas').clientHeight || canvasSize.width !== document.getElementById('canvas').clientWidth){
                    setCanvasSize({
                        height: document.getElementById('canvas').clientHeight,
                        width: document.getElementById('canvas').clientWidth
                    })
                }
            }
        }, [canvasSize])
    
        useEffect(()=>{
            setCanvas()
        }, [setCanvas])
    
        const [target, setTarget] = useRecoilState(targetAtom)
    
        window.onresize = () => {
            setCanvas()
            if(target){
                setTarget(null)
            }
        }
    
        if(document.getElementById('main')){
            document.getElementById('main').onmousedown = (e) => {
                if(e&&e.target&&e.target.id){
                    if(!e.target.id.includes('asset')){
                        setTarget(null)
                    }
                }
            }
        }
    
        if(document.getElementById('canvas')){
    
            document.getElementById('canvas').onmouseup = (e) => {
                if(e&&e.target&&e.target.id){
                    if(e.target.id.includes('asset')){
                        if(e.shiftKey || e.ctrlKey || e.altKey){
                            if(!target.includes(e.target)){
                                setTarget([...target, e.target])
                            }else{
                                setTarget(target.filter(i=>i!==e.target))
                            }
                        }else{
                            if(target && Array.isArray(target)){
                                if(!target.includes(e.target)){
                                    setTarget([e.target])
                                }
                            }else{
                                setTarget([e.target])
                            }
                        }
                    }
                }
            }
    
            let distance = 0
    
            document.getElementById('canvas').onkeydown = (e) => {
                if(target && target.length >= 1 && !e.shiftKey && !e.ctrlKey && !e.altKey){
                    let direction = false
                    switch (e.key) {
                        case 'ArrowRight':
                            direction = 'left'
                            distance++
                        break
                        case 'ArrowLeft':
                            direction = 'left'
                            distance--
                        break
                        case 'ArrowUp':
                            direction = 'top'
                            distance--
                        break
                        case 'ArrowDown':
                            direction = 'top'
                            distance++
                        break
                        case 'Delete':
                            let projectString = JSON.stringify(project)
                            let newProject = JSON.parse(projectString)
                            target.forEach((item)=>{
                                let layer = item.attributes[1].value
                                let asset = item.attributes[2].value
                                newProject['layers'][layer]['assets'] = newProject['layers'][layer]['assets'].filter((_,i)=>i!==parseInt(asset))
                                if(newProject['layers'][layer]['assets'][0]){
                                    newProject['layers'][layer]['assets'][0].active = true
                                }else{
                                    newProject['layers'][layer]['assets'] = null
                                }
                            })
                            updateDoc(doc(db, 'projects', activeProject), {
                                ...newProject
                            })
                        break
                        default:
                            direction = false
                        break
                    }
                    let newTarget = target.map((item)=>{
                        let newItem = item
                        newItem.style[direction] = (parseInt(newItem.style[direction]) + distance) + '%'
                        return newItem
                    })
                    setTarget(null)
                    setTarget(newTarget)
                }
            }
    
            document.getElementById('canvas').onkeyup = (e) => {
                if(target && target.length >= 0 && !e.shiftKey && !e.ctrlKey && !e.altKey){
                    let direction = false
                    switch (e.key) {
                        case 'ArrowRight':
                            direction = 'left'
                        break
                        case 'ArrowLeft':
                            direction = 'left'
                        break
                        case 'ArrowUp':
                            direction = 'top'
                        break
                        case 'ArrowDown':
                            direction = 'top'
                        break
                        default:
                            direction = false
                        break
                    }
                    if(direction){
                        let projectString = JSON.stringify(project)
                        let newProject = JSON.parse(projectString)
                        target.forEach((item)=>{
                            let layer = item.attributes[1].value
                            let asset = item.attributes[2].value
                            if( newProject['layers'][layer]['assets'][asset].style[direction] !== item.style[direction]){
                                newProject['layers'][layer]['assets'][asset].style[direction] = item.style[direction]
                            }
                        })
                        updateDoc(doc(db, 'projects', activeProject), {
                            ...newProject
                        })
                    }
                    distance = 0
                }
            }
    
        }
    
        const displayLayers = Object.keys(layers).sort((a, b)=>layers[a].index-layers[b].index)
        displayLayers.reverse()

        return (
            <div className={styles.main} id='main'>
                <div id='canvasWrapper' className={styles.canvasWrapper} style={{aspectRatio: `${project.canvas.width}/${project.canvas.height}`}}>
                    <div id='canvas' tabIndex={0} className={styles.canvas} style={{backgroundColor: project.canvas.background}}>
                        {displayLayers.map((item, key)=>{
                                if(layers[item]['assets']){
                                    return layers[item]['assets'].map((item2, i)=>{
                                                let style = {...item2.style, width: '100%', height: '100%', left: 0, top: 0, transform: 'none', filter: `brightness(${item2.style.brightness}) contrast(${item2.style.contrast}) saturate(${item2.style.saturatation}) hue-rotate(${item2.style.hue}) sepia(${item2.style.sepia})`}
                                                if(item2.active && canvasSize){
                                                    return (
                                                        <div id={'asset-'+key} data-layer={item} data-asset={i} data-aspect={item2.style.lockAspectRatio} className={styles.imgWrapper} key={key} style={{top: item2.style.top, left: item2.style.left, width: item2.style.width, height: item2.style.height, transform: `rotate(${item2.style.rotate})`}}>
                                                            <img src={item2.elem} alt={item2.name} style={{...style}} />
                                                        </div>
                                                    )
                                                }else{
                                                    return null
                                                }
                                            })
                                }else{
                                    return null
                                }
                            })}
                            {target&&target[0]?
                                <Moveable
                                    snappable={true}
                                    elementGuidelines={target}
                                    snapDirections={{'top': true, 'right': true, 'bottom': true, 'left': true}}
                                    elementSnapDirections={{'top': true, 'right': true, 'bottom': true, 'left': true}}
                                    target={target}
                                    draggable={true}
                                    resizable={true}
                                    rotatable={true}
                                    keepRatio={JSON.parse(target[0].attributes[3].value)}
                                    throttleDrag={0}
                                    startDragRotate={0}
                                    throttleDragRotate={0}
                                    zoom={1}
                                    origin={true}
                                    padding={{"left":0,"top":0,"right":0,"bottom":0}}
                                    onDrag={(e) => {
                                        e.target.style.left = e.left/canvasSize.width*100+'%'
                                        e.target.style.top = e.top/canvasSize.height*100+'%'
                                    }}
                                    onDragGroup={(e)=>{
                                        e.targets.forEach((item, i)=>{
                                            item.style.left = e.events[i].left/canvasSize.width*100+'%'
                                            item.style.top = e.events[i].top/canvasSize.height*100+'%'
                                        })
                                    }}
                                    onDragEnd={(e)=>{
                                        let left = e.target.style.left
                                        let top = e.target.style.top
                                        let layer = e.target.attributes[1].value
                                        let asset = e.target.attributes[2].value
                                        let projectString = JSON.stringify(project)
                                        let newProject = JSON.parse(projectString)
                                        newProject['layers'][layer]['assets'][asset].style = {...newProject['layers'][layer]['assets'][asset].style, top: top, left: left}
                                        updateDoc(doc(db, 'projects', activeProject), {
                                            ...newProject
                                        })
                                    }}
                                    onDragGroupEnd={(e)=>{
                                        let projectString = JSON.stringify(project)
                                        let newProject = JSON.parse(projectString)
                                        e.events.forEach((x)=>{
                                            let left = x.target.style.left
                                            let top = x.target.style.top
                                            let layer = x.target.attributes[1].value
                                            let asset = x.target.attributes[2].value
                                            newProject['layers'][layer]['assets'][asset].style = {...newProject['layers'][layer]['assets'][asset].style, top: top, left: left}
                                        })
                                        updateDoc(doc(db, 'projects', activeProject), {
                                            ...newProject
                                        })
                                    }}
                                    onResize={(e)=>{
                                        e.target.style.left = e.drag.left+'px'
                                        e.target.style.top = e.drag.top+'px'
                                        e.target.style.width = e.width/canvasSize.width*100+'%'
                                        e.target.style.height  = e.height/canvasSize.height*100+'%'
                                    }}
                                    onResizeEnd={(e)=>{
                                        let width = e.lastEvent.width/canvasSize.width*100+'%'
                                        let height = e.lastEvent.height/canvasSize.height*100+'%'
                                        let left = parseInt(e.target.style.left)/canvasSize.width*100+'%'
                                        let top = parseInt(e.target.style.top)/canvasSize.height*100+'%'
                                        let layer = e.target.attributes[1].value
                                        let asset = e.target.attributes[2].value
                                        let projectString = JSON.stringify(project)
                                        let newProject = JSON.parse(projectString)
                                        newProject['layers'][layer]['assets'][asset].style = {...newProject['layers'][layer]['assets'][asset].style, width: width, height: height, top: top, left: left}
                                        updateDoc(doc(db, 'projects', activeProject), {
                                            ...newProject
                                        })
                                    }}
                                    onResizeGroup = {(e) => {
                                        e.targets.forEach((item, i)=>{
                                            item.style.left = (e.events[i].drag.left)/canvasSize.width*100+'%'
                                            item.style.top = (e.events[i].drag.top)/canvasSize.height*100+'%'
                                            item.style.height = e.events[i].height/canvasSize.height*100+'%'
                                            item.style.width = e.events[i].width/canvasSize.width*100+'%'
                                        })
                                    }}
                                    onResizeGroupEnd={(e)=>{
                                        let projectString = JSON.stringify(project)
                                        let newProject = JSON.parse(projectString)
                                        e.events.forEach((e)=>{
                                            let left = e.target.style.left
                                            let top = e.target.style.top
                                            let width = e.target.style.width
                                            let height = e.target.style.height
                                            let layer = e.target.attributes[1].value
                                            let asset = e.target.attributes[2].value
                                            newProject['layers'][layer]['assets'][asset].style = {...newProject['layers'][layer]['assets'][asset].style, top: top, left: left, height: height, width: width}
                                        })
                                        updateDoc(doc(db, 'projects', activeProject), {
                                            ...newProject
                                        })
                                    }}
                                    onRotate={(e)=>{
                                        e.target.style.transform = e.transform
                                    }}
                                    onRotateEnd={(e)=>{
                                        let layer = e.target.attributes[1].value
                                        let asset = e.target.attributes[2].value
                                        let rotate = `${e.lastEvent.rotate}deg`
                                        let projectString = JSON.stringify(project)
                                        let newProject = JSON.parse(projectString)
                                        newProject['layers'][layer]['assets'][asset].style = {...newProject['layers'][layer]['assets'][asset].style, rotate: rotate}
                                        updateDoc(doc(db, 'projects', activeProject), {
                                            ...newProject
                                        })
                                    }}
                                    onRotateGroup={(e)=>{
                                        e.events.forEach((event)=>{
                                            event.target.style.transform = event.drag.transform
                                        })
                                    }}
                                    onRotateGroupEnd={(e)=>{
                                        let projectString = JSON.stringify(project)
                                        let newProject = JSON.parse(projectString)
                                        e.events.forEach((e)=>{
                                            let rotate = `${e.lastEvent.rotate}deg`
                                            let left = (parseInt(e.target.style.left.replace('%',''))+e.lastEvent.drag.beforeTranslate[0]/canvasSize.width*100)+'%'
                                            let top = (parseInt(e.target.style.top.replace('%',''))+e.lastEvent.drag.beforeTranslate[1]/canvasSize.height*100)+'%'
                                            let layer = e.target.attributes[1].value
                                            let asset = e.target.attributes[2].value
                                            newProject['layers'][layer]['assets'][asset].style = {...newProject['layers'][layer]['assets'][asset].style, rotate: rotate, left: left, top: top}
                                        })
                                        updateDoc(doc(db, 'projects', activeProject), {
                                            ...newProject
                                        })
                                    }}
                                />
                            :null}
                            <Selecto
                                dragContainer={'#main'}
                                boundContainer={'#main'}
                                selectableTargets={[`.${styles.imgWrapper}`]}
                                hitRate={120}
                                selectByClick={true}
                                selectFromInside={true}
                                ratio={0}
                                onDragStart={(e)=>{
                                    if(target && Array.isArray(target)){
                                        if(target.some(i=>e.currentTarget.selectedTargets.includes(i))){
                                            e.stop()
                                        }
                                    }
                                }}
                                onSelectEnd={e => {
                                    if(e.selected.length > 0){
                                        if(e.rect.height > 30 || e.rect.width > 30){
                                            setTarget(e.selected)
                                        }
                                    }
                                }}
                            />
                    </div>
                </div>
            </div>
        )
    }else{
        return <Navigate to='/dashboard' />
    }

}

export default Main