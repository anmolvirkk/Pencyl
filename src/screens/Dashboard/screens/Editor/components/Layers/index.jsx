import { Plus } from 'react-feather'
import { useRecoilState, useSetRecoilState } from 'recoil'
import modalAtom from '../../../../components/Modal/modalAtom'
import MoreMenu from '../../../../components/MoreMenu'
import projectsAtom from '../../../projectsAtom'
import styles from './_layers.module.sass'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import targetAtom from '../Main/targetAtom'

const AddLayer = () => {
    
    const setModal = useSetRecoilState(modalAtom)

    const [projects, setProjects] = useRecoilState(projectsAtom)
    
    let layers = projects[projects.active].layers
    
    const addLayer = (layerName) => {
        let projectsString = JSON.stringify(projects)
        let newProjects = JSON.parse(projectsString)
        let shouldAddLayer = true
        Object.keys(newProjects[projects.active].layers).forEach((item)=>{
            if(item === layerName.toLowerCase().replaceAll(/\s/g,'')){
                shouldAddLayer = false
            }
        })
        if(shouldAddLayer){
            if(layerName !== ''){
                if(isNaN(layerName.toLowerCase().replaceAll(/\s/g,'').charAt(0))){
                    newProjects[projects.active].layers = {...layers, [layerName.toLowerCase().replaceAll(/\s/g,'')]: {}}
                    setProjects(newProjects)
                    setModal({type: null})
                }else{
                    setModal({type: 'addLayer', func: addLayer, error: 'Layer name cannot start with a number'})
                }
            }else{
                setModal({type: 'addLayer', func: addLayer, error: 'Layer name cannot be empty'})
            }
        }else{
            setModal({type: 'addLayer', func: addLayer, error: 'Layer name taken'})
        }
    }
    return (
        <div className={styles.addLayer} onMouseDown={()=>setModal({type: 'addLayer', func: addLayer})}>
            <div className={styles.wrapper}>
                <Plus />
                <p>Add Layer</p>
            </div>
        </div>
    )
}

const Layer = ({name}) => {

    const [projects, setProjects] = useRecoilState(projectsAtom)
    
    let layers = projects[projects.active].layers
    
    const setLayers = (layers) => {
        let projectsString = JSON.stringify(projects)
        let newProjects = JSON.parse(projectsString)
        newProjects[projects.active].layers = {...layers}
        setProjects(newProjects)
    }

    const setModal = useSetRecoilState(modalAtom)

    const Title = () => {
        if(name){
            const removeLayer = () => {
                let newLayers = {}
                Object.keys(layers).forEach((item)=>{
                    if(item !== name){
                        newLayers = {...newLayers, [item]: layers[item]}
                    }
                })
                setLayers({...newLayers})
                setModal({type: null})
            }
            const addElement = (e) => {
                let assetId = new Date().valueOf()
                let projectsString = JSON.stringify(projects)
                let newProjects = JSON.parse(projectsString)
                Object.keys(newProjects[projects.active].layers).forEach((item)=>{
                    if(item === name){
                        newProjects[projects.active].layers[item].active = true
                    }else{
                        newProjects[projects.active].layers[item].active = false
                    }
                })
                let layerStyle = {
                    height: 'auto', 
                    width: '100%', 
                    lockAspectRatio: true,
                    top: '0%', 
                    left: '0%',
                    rotate: '0deg',
                    brightness: '100%',
                    contrast: '100%',
                    saturatation: '100%',
                    hue: '0deg',
                    sepia: '0%'
                }
                if(newProjects[projects.active].layers[name]&&newProjects[projects.active].layers[name]['assets']){
                        let resetActiveAssets = newProjects[projects.active].layers[name]['assets'].map((item)=>{
                            let newItem = {...item}
                            newItem.active = false
                            return newItem
                        })
                        newProjects[projects.active].layers = {
                            ...newProjects[projects.active].layers,
                            [name]: {
                                assets: [...resetActiveAssets, {
                                    elem: e.target.src,
                                    rare: '',
                                    active: true,
                                    id: assetId,
                                    style: layerStyle
                                }],
                                active: true
                            }
                        }
                        setProjects({...newProjects})
                }else{
                    newProjects[projects.active].layers = {
                        ...newProjects[projects.active].layers,
                        [name]: {
                            assets: [{
                                elem: e.target.src,
                                rare: '',
                                active: true,
                                id: assetId,
                                style: layerStyle
                            }],
                            active: true
                        }
                    }
                    setProjects({...newProjects})
                }
                setModal({type: null})
            }
            const editLayerModal = () => {
                const editLayer = (newName) => {
                    let projectsString = JSON.stringify(projects)
                    let newProjects = JSON.parse(projectsString)
                    let newLayers = {}
                    let rename = true
                    Object.keys(newProjects[projects.active].layers).forEach((item)=>{
                        let newItem = item
                        if(item === name){
                            Object.keys(newProjects[projects.active].layers).forEach((item)=>{
                                if(item === newName){
                                    rename = false
                                }
                            })
                            if(rename){
                                if(newName !== ''){
                                    if(isNaN(newName.toLowerCase().replaceAll(/\s/g,'').charAt(0))){
                                        newItem = newName
                                    }else{
                                        setModal({type: 'addLayer', func: editLayer, error: 'Layer name cannot start with a number'})
                                    }
                                }else{
                                    setModal({type: 'addLayer', func: editLayer, error: 'Layer name cannot be empty'})
                                }
                            }else{
                                setModal({type: 'editLayer', func: editLayer, error: 'Layer name taken'})
                            }
                        }
                        newLayers = {...newLayers, [newItem]: newProjects[projects.active].layers[item]}
                    })
                    newProjects[projects.active].layers = newLayers
                    setProjects({...newProjects})
                    if(rename && isNaN(newName.toLowerCase().replaceAll(/\s/g,'').charAt(0))){
                        setModal({type: null})
                    }
                }
                setModal({type: 'editLayer', func: editLayer})
            }
            return (
                <div className={styles.layerbtn}>
                    <p>{name}</p>
                    <div className={styles.options}>
                        <div className={styles.addBtn}>
                            <Plus onMouseDown={()=>setModal({type: 'addElement', func: addElement})} />
                        </div>
                        <MoreMenu options={[{name: 'edit', func: editLayerModal},{name: 'delete', func: removeLayer}]} />
                    </div>
                </div>
            )
        }else{
            return null
        }
    }

    const Assets = () => {
        const [target, setTarget] = useRecoilState(targetAtom)
    
        let targets = []
    
        if(target){
            let reverseLayerKey = Object.keys(layers).reverse()
            if(!Array.isArray(target)){
                let index = parseInt(target.id.split('-')[1])
                targets = reverseLayerKey[index]
            }else{
                target.forEach((item)=>{
                    let index = parseInt(item.id.split('-')[1])
                    targets = [...targets, reverseLayerKey[index]]
                })
            }
        }

        let isActive = false

        if(!Array.isArray(target)){
            if(name === targets){
                isActive = true
            }
        }else{
            targets.forEach((item)=>{
                if(name === item){
                    isActive = true
                }
            })
        }

        const setActiveTarget = (i) => {
            let asset = document.getElementById('asset-'+i)
            if(target){
                if(asset !== target){
                    if(Array.isArray(target)){
                        if(!target.includes(asset)){
                            setTarget([...target, asset])
                        }else{
                            setTarget(target.filter(i=>i!==asset))
                        }
                    }else{
                        setTarget([target, asset])
                    }
                }else{
                    setTarget(null)
                }
            }else{
                setTarget(asset)
            }
        }
        const setActiveAsset = (asset, e) => {
            let isMoreMenu = e.target.className && typeof e.target.className === 'string' && e.target.className.split('_').indexOf('moremenu') > 0
            if(e.target.tagName !== 'svg' && !isMoreMenu){
                let layersString = JSON.stringify(layers)
                let layersParse = JSON.parse(layersString)
                let layerString = JSON.stringify(layers[name])
                let layerParse = JSON.parse(layerString)
                let reverseLayerKey = Object.keys(layersParse).reverse()
                reverseLayerKey.forEach((item, i)=>{
                    if(item === name){
                        layersParse[item].active = true
                        setActiveTarget(i)
                    }else{
                        layersParse[item].active = false
                    }
                })
                layerParse.assets = layerParse.assets.map((item)=>{
                    let newItem = {...item}
                    if(item.id === asset.id){
                        newItem.active = true
                    }else{
                        newItem.active = false
                    }
                    return newItem
                })
                layersParse[name] = {...layerParse}
                setLayers({...layersParse})
            }
        }
        const deleteAsset = (item) => {
            let assetRemoved = layers[name]['assets'].filter(i=>i.id!==item.id)
            if(assetRemoved.length > 0){
                setLayers({...layers, [name]: {...layers[name], assets: assetRemoved, active: false}})
            }else{
                setLayers({...layers, [name]: {...layers[name], assets: null, active: false}})
            }
        }
        const changeAsset = (item) => {
            const editElement = (e) => {
                let layersString = JSON.stringify(layers)
                let layersParse = JSON.parse(layersString)
                layersParse[name]['assets'] = layersParse[name]['assets'].map((item2)=>{
                    let newItem = {...item2}
                    if(item.id === item2.id){
                        newItem = {...item2,
                            elem: e.target.src
                        }
                    }
                    return newItem
                })
                setLayers({...layersParse})
                setModal({type: null})
            }
            setModal({type: 'editElement', func: editElement})
        }
        if(layers[name]&&layers[name]['assets']){
            return (
                <div className={styles.assets}>
                    {layers[name]['assets'].map((item, key)=>
                        <div onMouseDown={(e)=>setActiveAsset(item, e)} className={item.active?isActive?`${styles.item} ${styles.active} ${styles.highlight}`:`${styles.item} ${styles.active}`:styles.item} key={key}>
                            <img src={item.elem} alt='' />
                            <MoreMenu options={[{name: 'change', func: ()=>changeAsset(item)},{name: 'delete', func: ()=>{deleteAsset(item)}}]} />
                        </div>)
                    }
                </div>
            )
        }else{
            return null
        }
    }

    return (
        <div className={styles.layer}>
            <Title />
            <Assets />
        </div>
    )

}

const Layers = () => {

    const [projects, setProjects] = useRecoilState(projectsAtom)
    
    let layers = projects[projects.active].layers

    const reorderLayers = (e) => {
        let projectsString = JSON.stringify(projects)
        let newProjects = JSON.parse(projectsString)
        let newLayers = newProjects[projects.active].layers
        let newLayersKeys = Object.keys(newLayers)
        newLayersKeys.splice(e.destination.index, 0, newLayersKeys.splice(e.source.index, 1)[0])
        let finalLayers = {}
        newLayersKeys.forEach((item)=>{
            finalLayers = {...finalLayers, [item]: newLayers[item]}
        })
        newProjects[projects.active].layers = finalLayers
        setProjects({...newProjects})
    }

    const [target, setTarget] = useRecoilState(targetAtom)

    const checkTarget = () => {
        if(target){
            setTarget(null)
        }
    }

    return (
        <div className={styles.layersWrapper} onMouseDown={checkTarget}>
            <DragDropContext onDragEnd={(e)=>reorderLayers(e)}>
                <Droppable droppableId='droppable-1'>
                    {(provided)=>(
                        <div className={styles.layers} ref={provided.innerRef} {...provided.droppableProps}>
                            {Object.keys(layers).map((item, i)=>(
                                <Draggable key={i} draggableId={'draggable-'+i} index={i}>
                                    {(provided)=>(
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <Layer name={item} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <AddLayer />
        </div>
    )
}

export default Layers