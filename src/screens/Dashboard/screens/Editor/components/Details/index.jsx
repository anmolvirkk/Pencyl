import { useRecoilState } from 'recoil'
import projectsAtom from '../../../projectsAtom'
import styles from './_details.module.sass'

const Option = ({title, value, onBlur, type}) => {
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

        if(type === 'canvas'){
            unit = 'px'
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
    return <SingleUnit />
}

const Details = () => {
    const [projects, setProjects] = useRecoilState(projectsAtom)
    let style = false
    let onBlur = () => {}
    if(Object.keys(projects[projects.active].layers).length > 0){
        Object.keys(projects[projects.active].layers).forEach((item)=>{
            if(projects[projects.active].layers[item].active){
                if(Object.keys(projects[projects.active].layers[item]).length > 0){
                    projects[projects.active].layers[item]['assets'].forEach((item2, i)=>{
                        if(item2.active){
                            style = {items: item2.style, type: 'layers'}
                            onBlur = (key, value) => {
                                let projectsString = JSON.stringify(projects)
                                let newProjects = JSON.parse(projectsString)
                                if(key === 'rotate' || key === 'hue'){
                                    projects[projects.active].layers[item]['assets'][i].style[key] = value.replace('deg', '')+'deg'
                                }else if(key === 'background'){
                                    projects[projects.active].layers[item]['assets'][i].style[key] = value
                                }else{
                                    projects[projects.active].layers[item]['assets'][i].style[key] = value.replace('%', '')+'%'
                                }
                                setProjects({...newProjects})
                            }
                        }
                    })
                }
            }
        })
    }
    if(!style){
        style = {items: projects[projects.active].canvas, type: 'canvas'}
        onBlur = (key, value) => {
            let projectsString = JSON.stringify(projects)
            let newProjects = JSON.parse(projectsString)
            newProjects[projects.active].canvas[key] = value
            setProjects({...newProjects})
        }
    }

    return (
        <div className={styles.details}>
            {
                Object.keys(style.items).map((item, key)=>{
                    return <Option key={key} title={item} value={style.items[item]} type={style.type} onBlur={onBlur} />
                })
            }
        </div>
    )
}

export default Details