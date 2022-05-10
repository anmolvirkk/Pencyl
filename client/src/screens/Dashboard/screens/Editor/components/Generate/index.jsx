import React, { useRef, useState, useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import activeProjectAtom from '../../../activeProjectAtom'
import projectsAtom from '../../../projectsAtom'
import Header from '../Header'
import styles from './_generate.module.sass'
import { FixedSizeGrid as Grid } from "react-window"
import ReactDOMServer from 'react-dom/server'
import { toJpeg } from 'dom-to-image'
import loadingAtom from '../../../loadingAtom'

const Images = React.memo(({images}) => {

  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = JSON.parse(projects.filter(i=>i.id===activeProject)[0].project)

  const [resize, setResize] = useState(false)
  window.onresize = () => {
    setResize(!resize)
  }

  const gridIndex = useRef([])

  const Image = React.memo(({style, rowIndex, columnIndex}) => {
    let index = `${rowIndex}${columnIndex}`
    if(!gridIndex.current.includes(index)){
      gridIndex.current.push(index)
    }
    if(images.current[gridIndex.current.indexOf(index)]){
      let image = images.current[gridIndex.current.indexOf(index)]
      return (
        <div style={{...style, aspectRatio: `${currentProject.canvas.width}/${currentProject.canvas.height}`}}>
          <div className={styles.image} style={{backgroundColor: currentProject.canvas.background, width: '100%', height: '100%'}}>
              {image.map((item, key)=>{
                return (
                  <div key={key} className={styles.asset} style={{...item.style}}>
                    <img src={item.elem} alt='' />
                  </div>
                )
              })}
          </div>
        </div>
      )
    }else{
      return null
    }
  })

  return (
    <div className={styles.imagesWrapper} id='imagesWrapper'>
      <Grid 
        rowCount={Math.ceil(parseInt(currentProject.supply)/Math.floor(window.innerWidth / 300))}
        columnCount={Math.floor(window.innerWidth / 300)}
        height={window.innerHeight - 120}
        width={window.innerWidth}
        rowHeight={300}
        columnWidth={300 + (((window.innerWidth - 6) / 300) - Math.floor((window.innerWidth - 6) / 300))*300/Math.floor((window.innerWidth - 6) / 300)}
      >
      {Image}
      </Grid>
    </div>
  )

})

const Footer = React.memo(({images}) => {

  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = JSON.parse(projects.filter(i=>i.id===activeProject)[0].project)

  useEffect(()=>{
    if(document.getElementById('total')){
      document.getElementById('total').innerHTML = currentProject.supply
    }
  }, [])

  const download = () => {
    let promises = []
    let progress = 0
    const setProgress = async () => {
      progress = progress + 1
      setTimeout(()=>{
        document.getElementById('current').innerHTML = progress
        document.getElementById('progressIndicator').style.width = (((progress)/parseInt(currentProject.supply))*100)+'%'  
      }, 0)
    }
    const supplyImage = (i) => {
      if(i < parseInt(currentProject.supply)){
          let image = images.current[i]
          let div = document.createElement('div')
          let targetHTML = ReactDOMServer.renderToStaticMarkup(
            <div style={{backgroundColor: currentProject.canvas.background, position: 'relative', height: `${currentProject.canvas.height}px`, width: `${currentProject.canvas.width}px`}}>
                {image.map((item, key)=>{
                  return (
                    <div key={key} style={{...item.style, position: 'absolute'}}>
                      <img src={item.elem} alt='' style={{width: '100%'}} />
                    </div>
                  )
                })}
            </div>
          )
          div.innerHTML = targetHTML
          document.getElementById('download').append(div)
          promises.push(
            new Promise(res=>{
              toJpeg(div.childNodes[0]).then((e)=>{
                if(e !== 'data:,'){
                  promises.push(
                      fetch('http://localhost:5000/image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({folder: currentProject.name, image: e})
                      }).then((e)=>{
                        setProgress().then(()=>{
                          res(e)
                        })
                    })
                  )
                }
              })
            })
          )
          supplyImage(i+1)
      }else{
        Promise.all(promises)
      }
    }
    supplyImage(0)
  }
  return (
    <div className={styles.footer} id='footer'>
      <div className={styles.progress}>
        <div id='current'>0</div>&nbsp;/&nbsp;<div id='total' />
        <div className={styles.progressBar}>
          <div className={styles.progressIndicator} id='progressIndicator' />
        </div>
      </div>
      <div className={styles.btns}>
        <button className={styles.btn} onMouseDown={download}>
            Download Images
        </button>
        <button className={styles.btn}>
            Create NFT Collection
        </button>
      </div>
    </div>
  )
})

const Generate = () => {

  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = JSON.parse(projects.filter(i=>i.id===activeProject)[0].project)
  let layerKeys = Object.keys(currentProject.layers)
  layerKeys.reverse()

  const images = useRef([])

  const setLoading = useSetRecoilState(loadingAtom)

  if(images.current.length === 0){
    for(let i = 0; i < parseInt(currentProject.supply); i++){
      let image = []
      for(let i = 0; i < layerKeys.length; i++){
        const random = Math.floor(Math.random() * (currentProject.layers[layerKeys[i]].assets.length - 1))
        image.push(currentProject.layers[layerKeys[i]].assets[random])
      }
      images.current.push(image)
      if(i === parseInt(currentProject.supply) - 1){
        setTimeout(()=>{
          setLoading(false)
        }, 0)
      }
    }
  }

  return (
    <div className={styles.generate}>
        <Header type='generate' />
        <Images images={images} />
        <Footer images={images} />
        <div id='download' className={styles.download} />
    </div>
  )
}

export default React.memo(Generate)