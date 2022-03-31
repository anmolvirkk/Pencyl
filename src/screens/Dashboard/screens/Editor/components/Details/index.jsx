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
        if(title.toLowerCase() !== 'projectname'){
            if(title !== 'background'){
                if(e.which !== 8 && e.which !== 37 && e.which !== 39 && e.which !== 190 && e.which !== 189){
                    if(e.which < 48 || e.which > 57){
                        e.preventDefault()
                    }
                }
            }
        }
    }
    const SingleUnit = () => {
        let displayValue = value
        if(typeof value === 'string'){
            displayValue = value.replace(/%|deg|px/g,'')
        }
        let unit = '%'
        switch (title.toLowerCase()) {
            case 'projectname':
                unit = ''
            break
            case 'background':
                unit = ''
            break
            case 'rotate':
                unit = 'deg'
            break
            case 'hue':
                unit = 'deg'
            break
            default:
                unit = '%'
            break
        }

        let Input = () => {
            return (
                <div className={styles.inputWrapper}>
                    <div onBlur={(e)=>onBlur(title, e.target.innerText)} className={styles.input} contentEditable onKeyDown={(e)=>validate(e)} dangerouslySetInnerHTML={{__html: displayValue}} />
                    <div className={styles.unit}>{unit}</div>
                </div>
            )
        }

        switch (title.toLowerCase()) {
            case 'background':
                Input = () => {
                    return (
                        <input type='color' className={styles.colorPicker} onBlur={(e)=>onBlur(title, e.target.value)} defaultValue={displayValue} />
                    )
                }
            break
            default:
                Input = () => {
                    return (
                        <div className={styles.inputWrapper}>
                            <div onBlur={(e)=>onBlur(title, e.target.innerText)} className={styles.input} contentEditable onKeyDown={(e)=>validate(e)} dangerouslySetInnerHTML={{__html: displayValue}} />
                            <div className={styles.unit}>{unit}</div>
                        </div>
                    )
                }
            break
        }

        return (
            <div className={styles.option}>
                <div className={styles.title}>{title.toLowerCase()==='projectname'?'Project Name':title}</div>
                <Input />
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
    const [canvas, setCanvas] = useRecoilState(canvasAtom)
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
                                if(key === 'rotate' || key === 'hue'){
                                    newLayers[item]['assets'][i].style[key] = value.replace('deg', '')+'deg'
                                }else if(key === 'background'){
                                    newLayers[item]['assets'][i].style[key] = value
                                }else{
                                    newLayers[item]['assets'][i].style[key] = value.replace('%', '')+'%'
                                }
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
        onBlur = (key, value) => {
            let canvasString = JSON.stringify(canvas)
            let newCanvas = JSON.parse(canvasString)
            newCanvas.style[key] = value
            setCanvas(newCanvas)
        }
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