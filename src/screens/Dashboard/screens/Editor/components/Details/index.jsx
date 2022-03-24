import { useRecoilState } from 'recoil'
import layersAtom from '../Layers/layersAtom'
import canvasAtom from './canvasAtom'
import styles from './_details.module.sass'

const Option = ({title, style}) => {

    let value = style

    const onBlur = () => {
        // if(id){
        //     if(value !== details.assets[id].style[title]){
        //         let detailsString = JSON.stringify(details)
        //         let newDetails = JSON.parse(detailsString)
        //         newDetails.assets[id].style[title] = value
        //         setDetails(newDetails)
        //     }
        // }else{
        //     if(value !== style[title]){
        //         let detailsString = JSON.stringify(details)
        //         let newDetails = JSON.parse(detailsString)
        //         newDetails.canvas.style[title] = value
        //         setDetails(newDetails)
        //     }
        // }
    }

    const preventEnter = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault()
        }
    }

    return (
        <div className={styles.option}>
            <div className={styles.title}>{title}</div>
            <div className={styles.input} contentEditable defaultValue='test' onKeyDown={(e)=>preventEnter(e)} dangerouslySetInnerHTML={{__html: value}} />
        </div>
    )
}

const Details = () => {
    const [canvas] = useRecoilState(canvasAtom)
    const [layers] = useRecoilState(layersAtom)
    let style = false
    if(Object.keys(layers).length > 0){
        Object.keys(layers).forEach((item)=>{
            if(Object.keys(layers[item]).length > 0){
                layers[item]['assets'].forEach((item)=>{
                    if(item.active){
                        style = item.style
                    }
                })
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
                    return <Option key={key} title={item} style={style[item]} />
                })
            }
        </div>
    )
}

export default Details