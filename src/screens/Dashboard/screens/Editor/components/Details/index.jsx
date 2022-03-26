import { useRecoilState } from 'recoil'
import layersAtom from '../Layers/layersAtom'
import canvasAtom from './canvasAtom'
import styles from './_details.module.sass'

const Option = ({title, value, onBlur}) => {
    const validate = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault()
            onBlur(title, e.target.innerText)
        }
        if(e.which !== 8 && e.which !== 37 && e.which !== 39){
            if(e.which < 48 || e.which > 57){
                e.preventDefault()
            }
        }
    }
    const SingleUnit = () => {
        let displayValue = value
        if(typeof value === 'string'){
            displayValue = value.replace('%', '')
        }
        return (
            <div className={styles.option}>
                <div className={styles.title}>{title}</div>
                <div className={styles.inputWrapper}>
                    <div onBlur={(e)=>onBlur(title, e.target.innerText)} className={styles.input} contentEditable defaultValue='test' onKeyDown={(e)=>validate(e)} dangerouslySetInnerHTML={{__html: displayValue}} />
                    <div className={styles.unit}>%</div>
                </div>
            </div>
        )
    }
    const Filters = () => {
        return (
            <div className={styles.filters}>
                
            </div>
        )
    }
    switch (title) {
        case 'filter': return <Filters />
        default: return <SingleUnit />
    }
}

const Details = () => {
    const [canvas] = useRecoilState(canvasAtom)
    const [layers, setLayers] = useRecoilState(layersAtom)
    let style = false
    let onBlur = () => {}
    if(Object.keys(layers).length > 0){
        Object.keys(layers).forEach((item)=>{
            if(layers[item].active){
                if(Object.keys(layers[item]).length > 0){
                    layers[item]['assets'].forEach((item2, i)=>{
                        if(item2.active){
                            style = item2.style
                            onBlur = (key, value) => {
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
    if(!style){
        style = canvas.style 
    }

    return (
        <div className={styles.details}>
            {
                Object.keys(style).map((item, key)=>{
                    return <Option key={key} title={item} value={style[item]} onBlur={onBlur} />
                })
            }
        </div>
    )
}

export default Details