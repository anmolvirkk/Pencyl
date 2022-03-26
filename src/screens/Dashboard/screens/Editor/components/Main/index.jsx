import { useRecoilState } from 'recoil'
import canvasAtom from '../Details/canvasAtom'
import layersAtom from '../Layers/layersAtom'
import styles from './_main.module.sass'
import {Rnd} from 'react-rnd'

const Main = () => {
    const [layers] = useRecoilState(layersAtom)
    const [canvas] = useRecoilState(canvasAtom)
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
        console.log(ref)
        console.log(delta)
        console.log(pos)
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
                                                <Rnd onDragStop={(e, d)=>onDragStop(e, d)} onResizeStop={(e, d, ref, delta, pos)=>onResizeStop(e, d, ref, delta, pos)} key={key} default={{x: parseInt(item2.style.left), y: parseInt(item2.style.top), width: item2.style.width, height: item2.style.height, lockAspectRatio: true}}>
                                                    <img className={layers[item].active?styles.active:null} src={item2.elem.replace('png-64','png-512')} alt={item2.name} style={{...item2.style, border: '2px solid var(--primary)'}} />
                                                </Rnd>
                                            )
                                        }else{
                                            return (
                                                <img key={key} src={item2.elem.replace('png-64','png-512')} alt={item2.name} style={item2.style} />
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