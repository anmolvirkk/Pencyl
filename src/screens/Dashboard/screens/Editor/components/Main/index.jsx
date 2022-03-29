import { useRecoilState } from 'recoil'
import canvasAtom from '../Details/canvasAtom'
import layersAtom from '../Layers/layersAtom'
import styles from './_main.module.sass'
import {Rnd} from 'react-rnd'
import { useEffect, useRef } from 'react'
import OutsideClickHandler from 'react-outside-click-handler/build/OutsideClickHandler'

const Main = () => {
    const [layers, setLayers] = useRecoilState(layersAtom)
    const [canvas] = useRecoilState(canvasAtom)

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
        if(e.target.className.indexOf('details') < 0){
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

    const canvasElem = document.getElementById('canvas')
    const canvasWidth = canvasElem?canvasElem.clientWidth:null
    const canvasHeight = canvasElem?canvasElem.clientHeight:null
    const onDragStop = (e, d) => {
        let x = (d.lastX/canvasWidth)*100
        let y = (d.lastY/canvasHeight)*100
        onChange.current('left', x)
        onChange.current('top', y)
    }

    const onResizeStop = (e, d, ref) => {
        let regExp = /\(([^)]+)\)/
        let transform = regExp.exec(ref.style.transform)[1].split(', ')
        let x = (transform[0].replace('px','')/canvasWidth)*100
        let y = (transform[1].replace('px','')/canvasHeight)*100
        onChange.current('left', x)
        onChange.current('top', y)
        onChange.current('width', ref.style.width.replace('%', ''))
    }
    return (
        <div className={styles.main}>
            <div id='canvas' className={styles.canvas} style={{aspectRatio: `${canvas.style.width}/${canvas.style.height}`, backgroundColor: canvas.style.background}}>
                {Object.keys(layers).map((item)=>{
                    if(layers[item]['assets']){
                        return layers[item]['assets'].map((item2, key)=>{
                            console.log(item2.style)
                                    let style = {...item2.style, width: '100%', height: '100%', left: 0, top: 0, transform: `rotate(${item2.style.rotate})`, filter: `brightness(${item2.style.brightness}) contrast(${item2.style.contrast}) hue-rotate(${item2.style.hue}) sepia(${item2.style.sepia}) blur(${item2.style.blur})`}
                                    if(item2.active){
                                        if(layers[item].active){
                                            return (
                                                <OutsideClickHandler key={key} onOutsideClick={(e)=>setActiveCanvas(e)}>
                                                    <Rnd onDragStop={(e, d)=>onDragStop(e, d)} onResizeStop={(e, d, ref, delta, pos)=>onResizeStop(e, d, ref, delta, pos)} size={{width: item2.style.width, height: item2.style.height}} lockAspectRatio={true} default={{x: parseInt(item2.style.left)/100*canvasWidth, y: parseInt(item2.style.top)/100*canvasHeight}} >
                                                        <img className={styles.active} src={item2.elem.replace('png-64','png-512')} alt={item2.name} style={{...style, border: '1px solid var(--primary)'}} />
                                                    </Rnd>
                                                </OutsideClickHandler>
                                            )
                                        }else{
                                            return (
                                                <div className={styles.imgWrapper} key={key} onMouseDown={()=>setActiveAsset(item, item2)} style={{top: parseInt(item2.style.top)/100*canvasHeight, left: parseInt(item2.style.left)/100*canvasWidth, width: item2.style.width, height: item2.style.height}}>
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