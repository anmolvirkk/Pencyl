import { useEffect, useState } from 'react'
import { CornerDownRight, ChevronRight, Plus } from 'react-feather'
import styles from './_layers.module.sass'

const layers = {
    head: {
        sub: {
                eyes: {
                    sub: {
                        glasses: {
                            assets: [
                                {
                                    name: 'x',
                                    elem: null,
                                    rare: ''
                                },
                                {
                                    name: 'y',
                                    elem: null,
                                    rare: ''
                                },
                                {
                                    name: 'z',
                                    elem: null,
                                    rare: ''
                                }
                            ]
                        }
                    }
                },
                nose: {
                    assets: [
                        {
                            name: 'x',
                            elem: null,
                            rare: ''
                        },
                        {
                            name: 'y',
                            elem: null,
                            rare: ''
                        }
                    ]
                },
                ears: {
                    assets: [
                        {
                            name: 'y',
                            elem: null,
                            rare: ''
                        },
                        {
                            name: 'z',
                            elem: null,
                            rare: ''
                        }
                    ]
                }
            }
    },
    body: {
        assets: [
            {
                name: 'x',
                elem: null,
                rare: ''
            },
            {
                name: 'y',
                elem: null,
                rare: ''
            },
            {
                name: 'z',
                elem: null,
                rare: ''
            }
        ]
    },
    arms: {
        sub: {
            forearm: {
                sub: {
                    wrist: {
                        assets: [
                            {
                                name: 'x',
                                elem: null,
                                rare: ''
                            },
                            {
                                name: 'y',
                                elem: null,
                                rare: ''
                            },
                            {
                                name: 'z',
                                elem: null,
                                rare: ''
                            }
                        ]
                    }
                }
            },
            hands: {
                sub: {
                    accessories: {
                        assets: [
                            {
                                name: 'x',
                                elem: null,
                                rare: ''
                            },
                            {
                                name: 'y',
                                elem: null,
                                rare: ''
                            },
                            {
                                name: 'z',
                                elem: null,
                                rare: ''
                            }
                        ]
                    }
                }
            },
        }
    },
    legs: {
        assets: [
            {
                name: 'a',
                elem: null,
                rare: ''
            },
            {
                name: 'b',
                elem: null,
                rare: ''
            }
        ]
    }
}

const AddLayer = () => {
    return (
        <div className={styles.addLayer}>
            <Plus />
            <p>Add Layer</p>
        </div>
    )
}

const Layer = ({name}) => {
    const [assets, setAssets] = useState(null)
    const [sublayers, setSublayers] = useState(null)
    const [nav, setNav] = useState(null)

    useEffect(()=>{
        if(layers[name]['assets']){
            setAssets(layers[name]['assets'])
        }
    }, [name])

    const setSubLayer = (name) => {
        if(sublayers){
            if(sublayers[name]['sub']){
                setSublayers(sublayers[name]['sub'])
                setNav([...nav, name])
            }else{
                setAssets(sublayers[name]['assets'])
            }
        }else{
            if(Object.keys(layers[name])[0] !== 'assets'){
                setSublayers(layers[name]['sub'])
                setNav([name])
            }
        }
    }
    return (
        <div className={styles.layerWrapper}>
            {nav
            ?
            <div className={styles.nav}>
                <div className={styles.tags}>
                    {nav.map((item, key)=><div className={styles.tag} key={key}>/&nbsp;&nbsp;<p>{item}</p>&nbsp;&nbsp;</div>)}
                </div>
                <div className={styles.options}>
                    <CornerDownRight />
                    <Plus />
                </div>
            </div>  
            :null}
            {sublayers
            ?
            <div>
                {
                    Object.keys(sublayers).map((name, key)=>{
                        return (
                            <div key={key} className={styles.layer} onMouseDown={()=>setSubLayer(name)}>
                                <div className={styles.layerbtn}>
                                    <p>{name}</p>
                                    {assets?null:<ChevronRight />}
                                </div>
                                {assets?
                                <div className={styles.assets}>
                                    {assets.map((item, key)=><div className={styles.item} key={key}>{item.name}</div>)}
                                </div>:null}
                            </div>
                        )
                    })
                }
            </div>
            :
            <div className={styles.layer} onMouseDown={()=>setSubLayer(name)}>
                <div className={styles.layerbtn}>
                    <p>{name}</p>
                    {assets?null:<ChevronRight />}
                </div>
                {assets?
                <div className={styles.assets}>
                    {assets.map((item, key)=><div className={styles.item} key={key}>{item.name}</div>)}
                </div>:null}
            </div>}
        </div>
    )
}

const Layers = () => {
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