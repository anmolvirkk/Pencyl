import { Plus } from 'react-feather'
import { useRecoilState, useSetRecoilState } from 'recoil'
import modalAtom from '../../../../components/Modal/modalAtom'
import MoreMenu from '../../../../components/MoreMenu'
import detailsAtom from '../Details/detailsAtom'
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
    const [details, setDetails] = useRecoilState(detailsAtom)

    const LayerElem = ({name}) => {

        const setModal = useSetRecoilState(modalAtom)

        let layer = {
            name: name,
            assets: layers[name]['assets']
        }

        const Title = () => {
            if(layer.name){
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
                                id: assetId
                            }]}})
                    }else{
                        setLayers({...layers, [name]: {assets: [{
                            name: e.target.src.split('/')[e.target.src.split('/').length - 1],
                            elem: e.target.src,
                            rare: '',
                            active: true,
                            id: assetId
                        }]}})
                    }
                    let detailsString = JSON.stringify(details)
                    let newDetails = JSON.parse(detailsString)
                    Object.keys(newDetails.assets).forEach((item)=>{
                        if(newDetails.assets[item]){
                            newDetails.assets[item]['active'] = false
                        }
                    })
                    setDetails({...newDetails, assets: {...newDetails.assets, [assetId]:{
                        active: true,
                        style: {height: 'auto', width: '100%', top: '0%', left: '0%'}
                    }}})
                    setModal({type: null})
                }
                return (
                    <div className={styles.layerbtn}>
                        <p>{layer.name}</p>
                        <div className={styles.options}>
                            <div className={styles.addBtn}>
                                <Plus onMouseDown={()=>setModal({type: 'addElement', func: addElement})} />
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
                layersParse[name] = {...layerParse}
                setLayers({...layersParse})
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

    return <LayerElem name={name} />

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