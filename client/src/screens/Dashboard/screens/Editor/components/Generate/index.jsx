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
import Loader from '../../../Loading/components/Loader'

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
                let style = {...item.style, width: '100%', height: '100%', left: 0, top: 0, transform: 'none', filter: `brightness(${item.style.brightness}) contrast(${item.style.contrast}) saturate(${item.style.saturatation}) hue-rotate(${item.style.hue}) sepia(${item.style.sepia})`}
                return (
                  <div key={key} className={styles.asset} style={{top: item.style.top, left: item.style.left, width: item.style.width, height: item.style.height, transform: `rotate(${item.style.rotate})`}}>
                    <img src={item.elem} alt='' style={{...style}} />
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

  const rowHeight = 300*(currentProject.canvas.height/currentProject.canvas.width)
  const columnWidth = rowHeight*(currentProject.canvas.width/currentProject.canvas.height)

  return (
    <div className={styles.imagesWrapper} id='imagesWrapper'>
      <Grid 
        rowCount={Math.ceil(parseInt(currentProject.supply)/Math.floor(window.innerWidth / rowHeight))}
        columnCount={Math.floor(window.innerWidth / columnWidth)}
        height={window.innerHeight - 120}
        width={window.innerWidth}
        rowHeight={rowHeight}
        columnWidth={columnWidth + (((window.innerWidth - 6) / columnWidth) - Math.floor((window.innerWidth - 6) / columnWidth))*columnWidth/Math.floor((window.innerWidth - 6) / columnWidth)}
      >
      {Image}
      </Grid>
    </div>
  )

})

const Footer = React.memo(({images, loading, setLoading}) => {

  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = JSON.parse(projects.filter(i=>i.id===activeProject)[0].project)

  useEffect(()=>{
    if(document.getElementById('total')){
      document.getElementById('total').innerHTML = currentProject.supply
    }
  }, [])

  const download = () => {
    setLoading(true)
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
                  let style = {...item.style, width: '100%', height: '100%', left: 0, top: 0, transform: 'none', filter: `brightness(${item.style.brightness}) contrast(${item.style.contrast}) saturate(${item.style.saturatation}) hue-rotate(${item.style.hue}) sepia(${item.style.sepia})`}
                  return (
                    <div key={key} style={{position: 'absolute', top: item.style.top, left: item.style.left, width: item.style.width, height: item.style.height, transform: `rotate(${item.style.rotate})`}}>
                      <img src={item.elem} alt='' style={{...style}} />
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
        Promise.all(promises).then(()=>{
          setLoading(false)
        })
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
        <button className={styles.btn} onMouseDown={download} disabled={loading}>
            Download Images
        </button>
        <button className={styles.btn} disabled={loading}>
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

  const [loadingScreen, setLoadingScreen] = useState(false)

  const Loading = () => {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    )
  }

  return (
    <div className={styles.generate}>
        {loadingScreen?<Loading />:null}
        <Header type='generate' />
        <Images images={images} />
        <Footer images={images} loading={loadingScreen} setLoading={setLoadingScreen} />
        <div id='download' className={styles.download} />
    </div>
  )
}

export default React.memo(Generate)