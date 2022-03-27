import { useRecoilState } from 'recoil'
import canvasAtom from '../Details/canvasAtom'
import layersAtom from '../Layers/layersAtom'
import styles from './_main.module.sass'
import {Rnd} from 'react-rnd'
import { useEffect, useRef } from 'react'

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
    const onDragStop = (e, d) => {
        console.log(e)
        console.log(d)
        console.log(canvasElem)
        console.log(canvasWidth)
    }
    const onResizeStop = (e, d, ref) => {
        onChange.current('width', ref.style.width.replace('%', ''))
    }
    return (
        <div className={styles.main}>
            <div id='canvas' className={styles.canvas} style={{aspectRatio: `${canvas.style.width}/${canvas.style.height}`}}>
                {Object.keys(layers).map((item)=>{
                    if(layers[item]['assets']){
                        return layers[item]['assets'].map((item2, key)=>{
                                    if(item2.active){
                                        if(layers[item].active){
                                            return (
                                                <Rnd onDragStop={(e, d)=>onDragStop(e, d)} onResizeStop={(e, d, ref, delta, pos)=>onResizeStop(e, d, ref, delta, pos)} key={key} size={{width: item2.style.width, height: item2.style.height}} position={{x: parseInt(item2.style.left)/100*canvasWidth, y: parseInt(item2.style.top)/100*canvasWidth}} lockAspectRatio={true}>
                                                    <img className={layers[item].active?styles.active:null} src={item2.elem.replace('png-64','png-512')} alt={item2.name} style={{...item2.style, border: '2px solid var(--primary)', top: 0, left: 0, width: '100%', height: '100%'}} />
                                                </Rnd>
                                            )
                                        }else{
                                            return (
                                                <div className={styles.imgWrapper} key={key} onMouseDown={()=>setActiveAsset(item, item2)} style={{top: item2.style.top, left: item2.style.left}}>
                                                    <img src={item2.elem.replace('png-64','png-512')} alt={item2.name} style={item2.style} />
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