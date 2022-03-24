import { useRecoilState } from 'recoil'
import detailsAtom from '../Details/detailsAtom'
import layersAtom from '../Layers/layersAtom'
import styles from './_main.module.sass'

const Main = () => {
    const [layers] = useRecoilState(layersAtom)
    const [details] = useRecoilState(detailsAtom)
    return (
        <div className={styles.main}>
            <div className={styles.canvas} style={{aspectRatio: `${details.canvas.style.width}/${details.canvas.style.height}`}}>
                {Object.keys(layers).map((item)=>{
                    if(layers[item]['assets']){
                        return layers[item]['assets'].map((item, key)=>{
                                    if(item.active){
                                        return <img key={key} src={item.elem.replace('png-64','png-512')} alt={item.name} style={details.assets[item.id].style} />
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