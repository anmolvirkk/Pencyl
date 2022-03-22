import { useRecoilState } from 'recoil'
import layersAtom from '../Layers/layersAtom'
import styles from './_main.module.sass'

const Main = () => {
    const [layers] = useRecoilState(layersAtom)
    return (
        <div className={styles.main}>
            <div className={styles.canvas}>
                {Object.keys(layers).map((item)=>{
                    if(layers[item]['assets']){
                        return layers[item]['assets'].map((item, key)=>{
                                    if(item.active){
                                        return <img key={key} src={item.elem} alt={item.name} />
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