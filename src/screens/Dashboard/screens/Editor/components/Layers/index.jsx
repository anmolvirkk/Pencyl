import { useState } from 'react'
import { ChevronRight, CornerDownRight, Plus } from 'react-feather'
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
                        sub: {
                            fingers: {
                                sub: {
                                    thumb: {
                                        sub: {
                                            nail: {
                                                sub: {
                                                    colors: {
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
                                            }
                                        }
                                    }
                                }
                            }
                        }
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

    const [sublayers, setSublayers] = useState(false)

    const [nav, setNav] = useState(null)

    const Nav = () => {
        if(nav){
            return (
                <div className={styles.nav}>
                    <div className={styles.tags}>
                        {nav.map((item, key)=><div onMouseDown={()=>navigateSubLayers(item)} className={styles.tag} key={key}>/&nbsp;&nbsp;<p>{item}</p>&nbsp;&nbsp;</div>)}
                    </div>
                    <div className={styles.options}>
                        <CornerDownRight />
                    </div>
                </div>  
            )
        }else{
            return null
        }
    }

    const navigateSubLayers = (clicked) => {
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

    const LayerElem = ({name, sub}) => {

        const [layer] = useState({
            name: name,
            assets: sub?sub[name]['assets']:layers[name]['assets']
        })
    
        const Title = () => {
            if(layer.name){
                return (
                    <div className={styles.layerbtn} onMouseDown={()=>navigateSubLayers(layer.name)}>
                        <p>{layer.name}</p>
                        {layer['assets']?<Plus />:<ChevronRight />}
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
                        {layer.assets.map((item, key)=><div className={styles.item} key={key}>{item.name}</div>)}
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