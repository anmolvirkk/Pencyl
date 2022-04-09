import { useRecoilState } from 'recoil'
import projectsAtom from '../../../projectsAtom'
import targetAtom from '../Main/targetAtom'
import styles from './_details.module.sass'

const Option = ({title, value, onBlur, type}) => {
    const validate = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault()
            onBlur(title, e.target.innerText)
        }
        if(title !== 'Project Name'){
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
            case 'background':
                unit = ''
            break
            case 'lockaspectratio':
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
            if(title === 'Project Name'){
                unit = ''
            }
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
            case 'lockaspectratio':
                Input = () => {
                    return (
                        <div className={styles.toggle}>
                            <div className={`${styles.option} ${displayValue?styles.active:''}`} onMouseDown={()=>onBlur(title, true)}>On</div>
                            <div className={`${styles.option} ${!displayValue?styles.active:''}`} onMouseDown={()=>onBlur(title, false)}>Off</div>
                        </div>
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
                <div className={styles.title}>{title.toLowerCase()==='projectname'?'Project Name':title.toLowerCase()==='lockaspectratio'?'Lock Aspect Ratio':title}</div>
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

    const [target, setTarget] = useRecoilState(targetAtom)

    if(target){
        if(target.length <= 1){
            let layer = target[0].attributes[1].value
            let asset = target[0].attributes[2].value
            style = {items: projects[projects.active].layers[layer].assets[asset].style, type: 'layer'}
            onBlur = (key, value) => {
                let projectsString = JSON.stringify(projects)
                let newProjects = JSON.parse(projectsString)
                let unit = '%'
                switch (key.toLowerCase()) {
                    case 'background':
                        unit = ''
                    break
                    case 'lockaspectratio':
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
                newProjects[projects.active].layers[layer].assets[asset].style[key] = typeof value === 'boolean'?value:value+unit
                setProjects({...newProjects})
                const setEmpty = async () => {
                    setTarget(null)
                }
                setEmpty().then(()=>{
                    setTarget(target)
                })
            }
        }
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

    const changeName = (_, value) => {
        let projectsString = JSON.stringify(projects)
        let newProjects = JSON.parse(projectsString)
        newProjects[projects.active].name = value
        setProjects({...newProjects})
    }

    return (
        <div className={styles.details}>
            {style.type==='canvas'?<Option title='Project Name' value={projects[projects.active].name} type='canvas' onBlur={changeName} />:null}
            {
                Object.keys(style.items).map((item, key)=>{
                    return <Option key={key} title={item} value={style.items[item]} type={style.type} onBlur={onBlur} />
                })
            }
        </div>
    )
}

export default Details