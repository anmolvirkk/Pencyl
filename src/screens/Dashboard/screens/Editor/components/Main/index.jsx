import { useRecoilState } from 'recoil'
import canvasAtom from '../Details/canvasAtom'
import layersAtom from '../Layers/layersAtom'
import styles from './_main.module.sass'
import {Rnd} from 'react-rnd'

const Main = () => {
    const [layers, setLayers] = useRecoilState(layersAtom)
    const [canvas] = useRecoilState(canvasAtom)

    
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
        console.log(layer)
        console.log(asset)
        console.log(layersParse)
        setLayers({...layersParse})
    }

    const canvasElem = document.getElementById('canvas')
    const canvasWidth = canvasElem?canvasElem.style.cssText.split('/')[1].replace(';', ''):null
    const onDragStop = (e, d) => {
        console.log(e)
        console.log(d)
        console.log(canvasElem)
        console.log(canvasWidth)
    }
    const onResizeStop = (e, d, ref, delta, pos) => {
        console.log(e)
        console.log(d)
        console.log(ref.style.width)
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
                                                <Rnd onDragStop={(e, d)=>onDragStop(e, d)} onResizeStop={(e, d, ref, delta, pos)=>onResizeStop(e, d, ref, delta, pos)} key={key} default={{x: parseInt(item2.style.left), y: parseInt(item2.style.top), lockAspectRatio: true}}>
                                                    <img className={layers[item].active?styles.active:null} src={item2.elem.replace('png-64','png-512')} alt={item2.name} style={{...item2.style, border: '2px solid var(--primary)', top: 0, left: 0}} />
                                                </Rnd>
                                            )
                                        }else{
                                            return (
                                                <div className={styles.imgWrapper} key={key} onMouseDown={()=>setActiveAsset(item, item2)}>
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