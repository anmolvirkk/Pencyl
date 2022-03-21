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
                setSublayers(sublayers[clicked]['sub'])
                setNav([...nav, clicked])
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
                return (
                    <div className={styles.layerbtn} onMouseDown={(e)=>navigateSubLayers(layer.name,e)}>
                        <p>{layer.name}</p>
                        <div className={styles.options}>
                            <div className={styles.addBtn}>
                                <Plus onMouseDown={layer['assets']?()=>setModal({type: 'addElement'}):layer['sub']?()=>setModal({type: 'addLayer', func: addLayer}):()=>setModal({type: 'addElementOrLayer'})} />
                            </div>
                            <MoreMenu options={[{name: 'edit', func: ()=>{}},{name: 'delete', func: ()=>{}}]} />
                        </div>
                    </div>
                )
            }else{
                return null
            }
        }
    
        const Assets = () => {
            if(layer.assets){
                return (
                    <div className={styles.assets}>
                        {layer.assets.map((item, key)=><div className={styles.item} key={key}><p>{item.name}</p><MoreMenu options={[{name: 'edit', func: ()=>{}},{name: 'delete', func: ()=>{}}]} /></div>)}
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