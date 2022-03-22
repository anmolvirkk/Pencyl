import { useState } from 'react'
import { Plus } from 'react-feather'
import { useRecoilState, useSetRecoilState } from 'recoil'
import modalAtom from '../../../../components/Modal/modalAtom'
import MoreMenu from '../../../../components/MoreMenu'
import layersAtom from './layersAtom'
import styles from './_layers.module.sass'

const AddLayer = () => {
    const setModal = useSetRecoilState(modalAtom)
    const [layers, setLayers] = useRecoilState(layersAtom)
    const addLayer = (layerName) => {
        setLayers({...layers, [layerName.toLowerCase().replaceAll(/\s/g,'')]: {}})
        setModal({type: null})
    }
    return (
        <div className={styles.addLayer} onMouseDown={()=>setModal({type: 'addLayer', func: addLayer})}>
            <Plus />
            <p>Add Layer</p>
        </div>
    )
}

const Layer = ({name}) => {

    const [layers, setLayers] = useRecoilState(layersAtom)

    const [sublayers, setSublayers] = useState(false)

    const [nav, setNav] = useState(null)

    const Nav = () => {
        if(nav){
            return (
                <div className={styles.nav}>
                    <div className={styles.tags}>
                        {nav.map((item, key)=><div onMouseDown={()=>navigateSubLayers(item)} className={styles.tag} key={key}>/&nbsp;&nbsp;<p>{item}</p>&nbsp;&nbsp;</div>)}
                    </div>
                </div>  
            )
        }else{
            return null
        }
    }

    const navigateSubLayers = (clicked, e) => {
        const checkParent = (elem) => {
            if(typeof elem.className==='string'){
                if(elem.className.split('_').indexOf('moremenu') > 0 || elem.className.split('_').indexOf('addBtn') > 0){
                    return true
                }else if(elem.parentNode){
                    return checkParent(elem.parentNode)
                }else{
                    return false
                }
            }else if(elem.parentNode){
                return checkParent(elem.parentNode)
            }else{
                return false
            }
        }
        const moremenuClicked = e?checkParent(e.target):false
        if(!moremenuClicked){
            if(sublayers&&sublayers[clicked]){
                if(sublayers[clicked]['sub']){
                    setSublayers(sublayers[clicked]['sub'])
                    setNav([...nav, clicked])
                }
            }else if(clicked === name){
                if(sublayers === layers[name]['sub']){
                    setSublayers(false)
                    setNav(false)
                }else{
                    setSublayers(layers[name]['sub'])
                    setNav([name])
                }
            }else{
                let newNav = nav.map((item, key)=>{
                    if(key <= nav.indexOf(clicked)){
                        return item
                    }else{
                        return null
                    }
                }).filter(i=>i!==null)
                let newSubLayers = {...layers}
                newNav.forEach((item)=>{
                    if(newSubLayers[item]['sub']){
                        newSubLayers = newSubLayers[item]['sub']
                    }
                })
                setNav([...newNav])
                setSublayers(newSubLayers)
            }
        }
    }

    const LayerElem = ({name, sub}) => {

        const setModal = useSetRecoilState(modalAtom)

        let layer = {
            name: name,
            assets: sub?sub[name]['assets']:layers[name]['assets'],
            sub: sub?sub[name]?sub[name]['sub']:false:layers[name]?layers[name]['sub']:false
        }
    
        const Title = () => {
            if(layer.name){
                const addLayer = (layerName) => {
                    let newLayers = JSON.stringify(layers)
                    let parseLayers = JSON.parse(newLayers)
                    if(!sub){
                        parseLayers[name]['sub'] = {...layers[name]['sub'], [layerName.toLowerCase().replaceAll(/\s/g,'')]: {}}
                    }else{
                        let prevSub = JSON.stringify(sub)
                        let newSub = JSON.parse(prevSub)
                        newSub[name]['sub'] = {...newSub[name]['sub'], [layerName.toLowerCase().replaceAll(/\s/g,'')]: {}}
                        let replacedSub = newLayers.replace(prevSub, JSON.stringify(newSub))
                        parseLayers = JSON.parse(replacedSub)
                        setNav(null)
                        setSublayers(false)
                    }
                    setLayers({...parseLayers})
                    setModal({type: null})
                }
                const removeLayer = () => {
                    let newLayers = {}
                    if(!sub){
                        Object.keys(layers).forEach((item)=>{
                            if(item !== name){
                                newLayers = {...newLayers, [item]: layers[item]}
                            }
                        })
                    }else{
                        let allLayerString = JSON.stringify(layers)
                        let subLayerString = JSON.stringify(sub)
                        let subLayerRemoved = {}
                        Object.keys(sub).forEach((item)=>{
                            if(item !== name){
                                subLayerRemoved = {...subLayerRemoved, [item]: sub[item]}
                            }
                        })
                        let subLayerRemovedString = JSON.stringify(subLayerRemoved)
                        newLayers = JSON.parse(allLayerString.replace(`{"sub":${subLayerString}}`, subLayerRemovedString))
                        setNav(null)
                        setSublayers(false)
                    }
                    setLayers({...newLayers})
                    setModal({type: null})
                }
                const addElement = (e) => {
                    if(!sub){
                        if(layers[name]['assets']){
                            let resetActiveAssets = layers[name]['assets'].map((item)=>{
                                let newItem = {...item}
                                newItem.active = false
                                return newItem
                            })
                            setLayers({...layers, [name]: {assets: [...resetActiveAssets, {
                                name: e.target.src.split('/')[e.target.src.split('/').length - 1],
                                elem: e.target.src,
                                rare: '',
                                active: true,
                                id: new Date().valueOf()
                            }]}})
                        }else{
                            setLayers({...layers, [name]: {assets: [{
                                name: e.target.src.split('/')[e.target.src.split('/').length - 1],
                                elem: e.target.src,
                                rare: '',
                                active: true,
                                id: new Date().valueOf()
                            }]}})
                        }
                        setModal({type: null})
                    }
                }
                return (
                    <div className={styles.layerbtn} onMouseDown={(e)=>navigateSubLayers(layer.name,e)}>
                        <p>{layer.name}</p>
                        <div className={styles.options}>
                            <div className={styles.addBtn}>
                                <Plus onMouseDown={layer['assets']?()=>setModal({type: 'addElement', func: addElement}):layer['sub']?()=>setModal({type: 'addLayer', func: addLayer}):()=>setModal({type: 'addElementOrLayer', addLayer: addLayer, addElement: addElement})} />
                            </div>
                            <MoreMenu options={[{name: 'edit', func: ()=>{}},{name: 'delete', func: removeLayer}]} />
                        </div>
                    </div>
                )
            }else{
                return null
            }
        }
    
        const Assets = () => {
            const setActiveAsset = (asset) => {
                let layersString = JSON.stringify(layers)
                let layersParse = JSON.parse(layersString)
                let layerString = JSON.stringify(layer)
                let layerParse = JSON.parse(layerString)
                layerParse.assets = layerParse.assets.map((item)=>{
                    let newItem = {...item}
                    if(item.id === asset.id){
                        newItem.active = true
                    }else{
                        newItem.active = false
                    }
                    return newItem
                })
                console.log(layersParse)
                console.log(layerParse)
                console.log(asset)
                console.log(sub)
                if(!sub){
                    layerParse[name] = {...layerParse}
                    console.log(layers)
                    console.log(layersParse)
                    setLayers({...layersParse})
                }
            }
            if(layer.assets){
                return (
                    <div className={styles.assets}>
                        {layer.assets.map((item, key)=><div onMouseDown={()=>setActiveAsset(item)} className={item.active?`${styles.item} ${styles.active}`:styles.item} key={key}><p>{item.name}</p><MoreMenu options={[{name: 'edit', func: ()=>{}},{name: 'delete', func: ()=>{}}]} /></div>)}
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

    if(sublayers){
        return (
            <div className={styles.sublayers}>
                <Nav />
                {Object.keys(sublayers).map((item, key)=>{
                    return (
                        <LayerElem key={key} name={item} sub={sublayers} />
                    )
                })}
            </div>
        )
    }else{
        return (
            <LayerElem name={name} />
        )
    }

}

const Layers = () => {
    const [layers] = useRecoilState(layersAtom)
    return (
        <div className={styles.layersWrapper}>
            <div className={styles.layers}>
                {Object.keys(layers).map((item, key)=><Layer key={key} name={item} />)}
            </div>
            <AddLayer />
        </div>
    )
}

export default Layers