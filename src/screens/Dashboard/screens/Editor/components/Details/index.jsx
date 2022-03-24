import { useRecoilState } from 'recoil'
import detailsAtom from './detailsAtom'
import styles from './_details.module.sass'

const Option = ({title, id}) => {
    
    const [details, setDetails] = useRecoilState(detailsAtom)

    let value

    if(id){
        value = details.assets[id].style[title]
    }else{
        value = details.canvas.style[title]
    }

    const onBlur = () => {
        if(id){
            if(value !== details.assets[id].style[title]){
                let detailsString = JSON.stringify(details)
                let newDetails = JSON.parse(detailsString)
                newDetails.assets[id].style[title] = value
                setDetails(newDetails)
            }
        }else{
            if(value !== details.canvas.style[title]){
                let detailsString = JSON.stringify(details)
                let newDetails = JSON.parse(detailsString)
                newDetails.canvas.style[title] = value
                setDetails(newDetails)
            }
        }
    }

    return (
        <div className={styles.option}>
            <div className={styles.title}>{title}</div>
            <input onBlur={onBlur} type='text' defaultValue={value} onChange={(e)=>value=e.target.value} />
        </div>
    )
}

const Details = () => {
    const [details] = useRecoilState(detailsAtom)
    let options = []
    let id = false
    if(Object.keys(details.assets).length > 0){
        Object.keys(details.assets).forEach((item)=>{
            if(details.assets[item].active){
                id = item
                Object.keys(details.assets[item].style).forEach((item)=>{
                    options = [...options, {title: item}]
                })
            }
        })
    }else{
        Object.keys(details.canvas.style).forEach((item)=>{
            options = [...options, {title: item}]
        })
    }
    return (
        <div className={styles.details}>
            {
                options.map((item, key)=>{
                    return <Option id={id} key={key} {...item} />
                })
            }
        </div>
    )
}

export default Details