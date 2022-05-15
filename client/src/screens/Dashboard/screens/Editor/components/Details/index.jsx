import { useRecoilState, useSetRecoilState } from 'recoil'
import projectsAtom from '../../../projectsAtom'
import targetAtom from '../Main/targetAtom'
import styles from './_details.module.sass'
import React, { useCallback, useState } from 'react'
import activeProjectAtom from '../../../activeProjectAtom'

const Option = ({title, value, onBlur, type}) => {
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

        let Input = React.memo(() => {
            const [inputText, setInputText] = useState(displayValue)
            const validate = useCallback((e) => {
                let shouldPrevent = false
                if(e.nativeEvent.data){
                    if(title !== 'Project Name'){
                        if(!e.nativeEvent.data.match(/^\d+$/i)){
                            shouldPrevent = true
                        }
                    }
                }
                if(shouldPrevent){
                    e.preventDefault()
                }else{
                    setInputText(e.target.value)
                }
            }, [])
            return (
                <div className={styles.inputWrapper}>
                    <input type='text' value={inputText} onChange={(e)=>validate(e)} onBlur={inputText!==displayValue?()=>onBlur(title, inputText):null} className={styles.input} />
                    <div className={styles.unit}>{unit}</div>
                </div>
            )
        })

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
            default: <Input />
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
    const setProjects = useSetRecoilState(projectsAtom)
    const [activeProject] = useRecoilState(activeProjectAtom)
    const [projects] = useRecoilState(projectsAtom)
    let currentProject = projects[activeProject]
    if(currentProject){
        let style = false
        let onBlur = () => {}
    
        const [target, setTarget] = useRecoilState(targetAtom)
    
        const project = currentProject
    
        if(target){
            if(target.length <= 1 && target[0]){
                let layer = target[0].attributes[1].value
                let asset = target[0].attributes[2].value
                if(project&&project.layers&&project.layers[layer]&&project.layers[layer].assets){
                    if(project.layers[layer].assets[asset]){
                        style = {items: project.layers[layer].assets[asset].style, type: 'layer'}
                        onBlur = (key, value) => {
    
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
    
                            let projectString = JSON.stringify(project)
                            let newProject = JSON.parse(projectString)
                            newProject.layers[layer].assets[asset].style[key] = typeof value === 'boolean'?value:value+unit
                            
                            fetch('http://localhost:5000/'+activeProject, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(newProject)
                            }).then(e=>e.json()).then((e)=>{
                                setProjects(e)
                                let tempTarget = target
                                const setEmpty = async () => {
                                    setTarget(null)
                                }
                                setEmpty().then(()=>{
                                    setTarget(tempTarget)
                                })
                            })
                        }
                    }
                }
            }
        }
    
        if(!style){
            style = {items: project.canvas, type: 'canvas'}
            onBlur = (key, value) => {
                let projectString = JSON.stringify(project)
                let newProject = JSON.parse(projectString)
                newProject.canvas[key] = value
                fetch('http://localhost:5000/'+activeProject, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newProject)
                }).then(e=>e.json()).then((e)=>{
                    setProjects(e)
                })
            }
        }
    
        const changeName = useCallback((_, value) => {
    
            let projectString = JSON.stringify(project)
            let newProject = JSON.parse(projectString)
            newProject.name = value
            
            fetch('http://localhost:5000/'+activeProject, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProject)
            }).then(e=>e.json()).then((e)=>{
                setProjects(e)
            })
    
        }, [activeProject, project, setProjects])
    
        return (
            <div className={styles.details}>
                {style.type==='canvas'?<Option title='Project Name' value={project.name} type='canvas' onBlur={changeName} />:null}
                {
                    Object.keys(style.items).map((item, key)=>{
                        return <Option key={key} title={item} value={style.items[item]} type={style.type} onBlur={onBlur} />
                    })
                }
            </div>
        )
    }else{
        return null
    }
}

export default Details