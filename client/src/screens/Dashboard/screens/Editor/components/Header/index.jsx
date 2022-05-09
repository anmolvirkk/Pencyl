import styles from './_header.module.sass'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import projectsAtom from '../../../projectsAtom'
import activeProjectAtom from '../../../activeProjectAtom'
import { useEffect, useRef, useState, useCallback } from 'react'
import loadingAtom from '../../../loadingAtom'

const Generate = () => {
    const [projects, setProjects] = useRecoilState(projectsAtom)
    const [activeProject] = useRecoilState(activeProjectAtom)
    
    let maxRef = useRef(1)
    const [max, setMax] = useState(0)

    useEffect(()=>{
        if(max !== maxRef.current){
            let currentProject = JSON.parse(projects.filter(i=>i.id===activeProject)[0].project)
            Object.keys(currentProject.layers).forEach((item)=>{
                maxRef.current = maxRef.current * currentProject.layers[item].assets.length
            })
            setMax(maxRef.current)
        }
    }, [maxRef, max, setMax, projects, activeProject])

    
    const [inputText, setInputText] = useState('')

    const validate = useCallback((e) => {
        let shouldPrevent = false
        if(e.nativeEvent.data){
            if(!e.nativeEvent.data.match(/^\d+$/i)){
                shouldPrevent = true
            }
        }
        if(shouldPrevent){
            e.preventDefault()
        }else{
            setInputText(e.target.value)
        }
    }, [])

    const [error, setError] = useState(false)

    const nav = useNavigate()

    const setLoading = useSetRecoilState(loadingAtom)

    const generate = () => {
        setLoading(true)
        if(inputText){
            if(parseInt(inputText) <= max){
                let projectString = projects.filter(i=>i.id===activeProject)[0].project
                let newProject = JSON.parse(projectString)
                newProject.supply = inputText
                fetch('http://localhost:5000/'+activeProject, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({project: newProject})
                }).then(e=>e.json()).then(e=>setProjects(e)).then(()=>{
                    nav('generate')
                })
            }else{
                setLoading(false)
                setError('Supply cannot be > max')
            }
        }else{
            setLoading(false)
            setError('Supply cannot be empty')
        }
    }

    return (
        <div className={styles.generateWrapper}>
            <div className={styles.inputWrapper}>
                <div className={`${styles.input} ${error?styles.error:''}`}>
                    <input onMouseDown={error?()=>setError(false):null} type='text' placeholder={!error?'Enter Supply':error} value={!error?inputText:''} onChange={(e)=>validate(e)} />
                    <div className={styles.max}>Max : {max}</div>
                </div>
            </div>
            <button className={styles.generate} onClick={generate}>
                Generate
            </button>
        </div>
    )
}

const Header = ({type}) => {
    const nav = useNavigate()
    return (
        <header className={styles.header}>
            <button onMouseDown={() => nav(-1)}><img alt='' src='/logo.png' /></button>
            {type!=='generate'?
                <div className={styles.menu}>
                    <Generate />
                </div>
            :null}
        </header>
    )
}

export default Header