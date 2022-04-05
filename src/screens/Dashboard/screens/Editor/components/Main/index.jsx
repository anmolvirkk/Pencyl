import { useRecoilState } from 'recoil'
import styles from './_main.module.sass'
import {Rnd} from 'react-rnd'
import { useCallback, useEffect, useRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler/build/OutsideClickHandler'
import projectsAtom from '../../../projectsAtom'

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

    const setActiveCanvas = (e) => {
        if(typeof e.target.className.indexOf === 'function' && e.target.className.indexOf('details') < 0){
            let layersString = JSON.stringify(layers)
            let layersParse = JSON.parse(layersString)
            Object.keys(layersParse).forEach((item)=>{
                layersParse[item].active = false
            })
            setLayers({...layersParse})
        }
    }
    
    const setActiveAsset = (layer, asset) => {
        let layersString = JSON.stringify(layers)
        let layersParse = JSON.parse(layersString)
        let layerString = JSON.stringify(layers[layer])
        let layerParse = JSON.parse(layerString)
        Object.keys(layersParse).forEach((item)=>{
            if(item === layer){
                layerParse.active = true
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
        layersParse[layer] = {...layerParse}
        setLayers({...layersParse})
    }

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
    }
    
    const [draging, setDraging] = useState(false)

    const onDragStop = (e, d) => {
        let x = (d.lastX/canvasSize.width)*100
        let y = (d.lastY/canvasSize.height)*100
        onChange.current('left', x)
        onChange.current('top', y)
        setDraging(false)
    }

    const onResizeStop = (e, d, ref) => {
        let regExp = /\(([^)]+)\)/
        let transform = regExp.exec(ref.style.transform)[1].split(', ')
        let x = (transform[0].replace('px','')/(canvasSize.width))*100
        let y = (transform[1].replace('px','')/(canvasSize.height))*100
        onChange.current('left', x)
        onChange.current('top', y)
        onChange.current('width', ref.style.width.replace('%', ''))
    }

    let displayLayers = Object.keys(layers)
    displayLayers.reverse()

    return (
        <div className={styles.main}>
            <div id='canvas' className={styles.canvas} style={{aspectRatio: `${projects[projects.active].canvas.width}/${projects[projects.active].canvas.height}`, backgroundColor: projects[projects.active].canvas.background}}>
                {displayLayers.map((item)=>{
                    if(layers[item]['assets']){
                        return layers[item]['assets'].map((item2, key)=>{
                                    let style = {...item2.style, width: '100%', height: '100%', left: 0, top: 0, transform: `rotate(${item2.style.rotate})`, filter: `brightness(${item2.style.brightness}) contrast(${item2.style.contrast}) hue-rotate(${item2.style.hue}) sepia(${item2.style.sepia})`}
                                    if(item2.active && canvasSize){
                                        if(layers[item].active){
                                            return (
                                                <OutsideClickHandler key={key} onOutsideClick={(e)=>setActiveCanvas(e)}>
                                                    <Rnd onResizeStart={()=>setDraging(true)} onDragStop={(e, d)=>onDragStop(e, d)} onResizeStop={(e, d, ref, delta, pos)=>onResizeStop(e, d, ref, delta, pos)} size={{width: item2.style.width, height: item2.style.height}} lockAspectRatio={true} default={{x: parseInt(item2.style.left)/100*canvasSize.width, y: parseInt(item2.style.top)/100*canvasSize.height}} position={!draging?{x: parseInt(item2.style.left)/100*canvasSize.width, y: parseInt(item2.style.top)/100*canvasSize.height}:null}>
                                                        <div style={{border: '1px solid var(--primary)'}}>
                                                            <img className={styles.active} src={item2.elem.replace('png-64','png-512')} alt={item2.name} style={{...style, marginBottom: '-3px'}} />
                                                        </div>
                                                    </Rnd>
                                                </OutsideClickHandler>
                                            )
                                        }else{
                                            return (
                                                <div className={styles.imgWrapper} key={key} onMouseDown={()=>setActiveAsset(item, item2)} style={{top: parseInt(item2.style.top)/100*canvasSize.height, left: parseInt(item2.style.left)/100*canvasSize.width, width: item2.style.width, height: item2.style.height}}>
                                                    <img src={item2.elem.replace('png-64','png-512')} alt={item2.name} style={{...style}} />
                                                </div>
                                            )
                                        }
                                    }else{
                                        return null
                                    }
                                })
                    }else{
                        return null
                    }
                })}
            </div>
        </div>
    )
}

export default Main