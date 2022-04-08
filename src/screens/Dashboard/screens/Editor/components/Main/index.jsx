import { useRecoilState } from 'recoil'
import styles from './_main.module.sass'
import { useCallback, useEffect, useRef, useState } from 'react'
import projectsAtom from '../../../projectsAtom'
import Moveable from 'react-moveable'
import targetAtom from './targetAtom'

const Main = () => {

    const [projects, setProjects] = useRecoilState(projectsAtom)

    let layers = projects[projects.active].layers

    const setLayers = useCallback((layers) => {
        let projectsString = JSON.stringify(projects)
        let newProjects = JSON.parse(projectsString)
        newProjects[projects.active].layers = {...layers}
        setProjects(newProjects)
    }, [projects, setProjects])

    let onChange = useRef(null)

    useEffect(()=>{
        if(Object.keys(layers).length > 0){
            Object.keys(layers).forEach((item)=>{
                if(layers[item].active){
                    if(Object.keys(layers[item]).length > 0){
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

    window.onresize = () => {
        setCanvas()
        if(target){
            setTarget(null)
        }
    }

    let displayLayers = Object.keys(layers)
    displayLayers.reverse()

    const [target, setTarget] = useRecoilState(targetAtom)

    const setCanvasTarget = (e) => {
        if(e.target.id){
            if(!e.target.id.includes('asset')){
                setTarget(null)
            }else if(e.target.id.includes('asset')){
                    
                    if(e.target !== target){
                        

                        if(e.shiftKey || e.ctrlKey || e.altKey){
                            if(Array.isArray(target)){
                                console.log(target)
                                if(!target.includes(e.target)){
                                    setTarget([...target, e.target])
                                }else{
                                    setTarget(target.filter(i=>i!==e.target))
                                }
                            }else{
                                setTarget([target, e.target])
                            }
                        }else{
                            if(target !== e.target){
                                setTarget(e.target)
                            }
                        }
                        
                    }else{
                        setTarget(null)
                    }

            }else{
                setTarget(null)
            }
        }else{
            setTarget(null)
        }
    }

    const resizePosition = useRef(null)

    return (
        <div className={styles.main} id='main' onClick={setCanvasTarget}>
            <div id='canvas' className={styles.canvas} style={{aspectRatio: `${projects[projects.active].canvas.width}/${projects[projects.active].canvas.height}`, backgroundColor: projects[projects.active].canvas.background}}>
                {displayLayers.map((item, key)=>{
                    if(layers[item]['assets']){
                        return layers[item]['assets'].map((item2, i)=>{
                                    let style = {...item2.style, width: '100%', height: '100%', left: 0, top: 0, transform: `rotate(${item2.style.rotate})`, filter: `brightness(${item2.style.brightness}) contrast(${item2.style.contrast}) hue-rotate(${item2.style.hue}) sepia(${item2.style.sepia})`}
                                    if(item2.active && canvasSize){
                                        return (
                                            <div id={'asset-'+key} data-layer={item} data-asset={i} className={styles.imgWrapper} key={key} style={{top: item2.style.top, left: item2.style.left, width: item2.style.width, height: item2.style.height}}>
                                                <img src={item2.elem.replace('png-64','png-512')} alt={item2.name} style={{...style}} />
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
                <Moveable
                    target={target}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    keepRatio={true}
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
                        let projectsString = JSON.stringify(projects)
                        let newProjects = JSON.parse(projectsString)
                        newProjects[projects.active]['layers'][layer]['assets'][asset].style = {...newProjects[projects.active]['layers'][layer]['assets'][asset].style, top: top, left: left}
                        setProjects(newProjects)
                    }}
                    onDragGroupEnd={(e)=>{
                        let projectsString = JSON.stringify(projects)
                        let newProjects = JSON.parse(projectsString)
                        e.events.forEach((e)=>{
                            let left = e.target.style.left
                            let top = e.target.style.top
                            let layer = e.target.attributes[1].value
                            let asset = e.target.attributes[2].value
                            newProjects[projects.active]['layers'][layer]['assets'][asset].style = {...newProjects[projects.active]['layers'][layer]['assets'][asset].style, top: top, left: left}
                        })
                        setProjects(newProjects)
                    }}
                    onResize={(e)=>{
                        e.target.style.width = e.width/canvasSize.width*100+'%'
                        e.target.style.height  = e.height/canvasSize.height*100+'%'
                        e.target.style.transform = `translate(${e.drag.beforeTranslate[0]}px, ${e.drag.beforeTranslate[1]}px)`
                        resizePosition.current = {
                            left: e.drag.beforeTranslate[0],
                            top: e.drag.beforeTranslate[1]
                        }
                    }}
                    onResizeEnd={(e)=>{
                        let width = e.lastEvent.width/canvasSize.width*100+'%'
                        let height = e.lastEvent.height/canvasSize.height*100+'%'
                        let left = e.lastEvent.drag.left/canvasSize.width*100+'%'
                        let top = e.lastEvent.drag.top/canvasSize.height*100+'%'
                        e.target.style.transform = 'none'
                        let layer = e.target.attributes[1].value
                        let asset = e.target.attributes[2].value
                        let projectsString = JSON.stringify(projects)
                        let newProjects = JSON.parse(projectsString)
                        newProjects[projects.active]['layers'][layer]['assets'][asset].style = {...newProjects[projects.active]['layers'][layer]['assets'][asset].style, width: width, height: height, top: top, left: left}
                        setProjects(newProjects)
                    }}
                    onResizeGroup={(e)=>{
                        let projectsString = JSON.stringify(projects)
                        let newProjects = JSON.parse(projectsString)
                        e.events.forEach((e)=>{
                            let left = e.drag.left/canvasSize.width*100+'%'
                            let top = e.drag.top/canvasSize.height*100+'%'
                            let width = e.width/canvasSize.width*100+'%'
                            let height = e.height/canvasSize.height*100+'%'
                            let layer = e.target.attributes[1].value
                            let asset = e.target.attributes[2].value
                            newProjects[projects.active]['layers'][layer]['assets'][asset].style = {...newProjects[projects.active]['layers'][layer]['assets'][asset].style, top: top, left: left, height: height, width: width}
                        })
                        setProjects(newProjects)
                    }}
                    onRotate={(e)=>console.log(e)}
                />
            </div>
        </div>
    )
}

export default Main