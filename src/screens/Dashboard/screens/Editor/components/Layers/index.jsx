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
            <div className={styles.wrapper}>
                <Plus />
                <p>Add Layer</p>
            </div>
        </div>
    )
}

const Layer = ({name}) => {

    const [layers, setLayers] = useRecoilState(layersAtom)

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
                let layersString = JSON.stringify(layers)
                let layersParse = JSON.parse(layersString)
                Object.keys(layersParse).forEach((item)=>{
                    if(item === name){
                        layersParse[item].active = true
                    }else{
                        layersParse[item].active = false
                    }
                })
                let layerStyle = {
                    height: 'auto', 
                    width: '100%', 
                    top: '0%', 
                    left: '0%',
                    filter: 'none',
                    boxShadow: 'none',
                    margin: 0,
                    padding: 0,
                    opacity: 1,
                    mixBlendMode: 'none',
                    borderRadius: 0,
                    border: 'none',
                    backgroundColor: 'transparent'
                }
                if(layers[name]['assets']){
                        let resetActiveAssets = layers[name]['assets'].map((item)=>{
                            let newItem = {...item}
                            newItem.active = false
                            return newItem
                        })
                        setLayers({...layersParse, 
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
                        })
                }else{
                    setLayers({...layersParse, 
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
                    })
                }
                setModal({type: null})
            }
            return (
                <div className={styles.layerbtn}>
                    <p>{name}</p>
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
        const setActiveAsset = (asset, e) => {
            let isMoreMenu = e.target.className && typeof e.target.className === 'string' && e.target.className.split('_').indexOf('moremenu') > 0
            if(e.target.tagName !== 'svg' && !isMoreMenu){
                let layersString = JSON.stringify(layers)
                let layersParse = JSON.parse(layersString)
                let layerString = JSON.stringify(layers[name])
                let layerParse = JSON.parse(layerString)
                Object.keys(layersParse).forEach((item)=>{
                    if(item === name){
                        layerParse.active = true
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
        if(layers[name]['assets']){
            return (
                <div className={styles.assets}>
                    {layers[name]['assets'].map((item, key)=>
                        <div onMouseDown={(e)=>setActiveAsset(item, e)} className={item.active?`${styles.item} ${styles.active}`:styles.item} key={key}>
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