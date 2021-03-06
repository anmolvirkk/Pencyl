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
import modalAtom from '../../../../components/Modal/modalAtom'
import { Navigate } from 'react-router-dom'

const Images = React.memo(({images}) => {

  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = projects.filter(i=>i.id===activeProject)[0]

  if(currentProject){
    let rowHeight = 300*(currentProject.data.canvas.height/currentProject.data.canvas.width)
    let columnWidth = rowHeight*(currentProject.data.canvas.width/currentProject.data.canvas.height)

    let rowCount = Math.ceil(parseInt(currentProject.data.supply)/Math.floor(window.innerWidth / rowHeight))
    let columnCount = Math.floor(window.innerWidth / columnWidth)

    const [resize, setResize] = useState(false)

    window.onresize = () => {
      setResize(!resize)
      let newRowHeight = 300*(currentProject.data.canvas.height/currentProject.data.canvas.width)
      let newColumnWidth = rowHeight*(currentProject.data.canvas.width/currentProject.data.canvas.height)
      let newRowCount = Math.ceil(parseInt(currentProject.data.supply)/Math.floor(window.innerWidth / newRowHeight))
      let newColumnCount = Math.floor(window.innerWidth / newColumnWidth)
      if(rowHeight !== newRowHeight && columnWidth !== newColumnWidth && rowCount !== newRowCount && columnCount !== newColumnCount){
        rowHeight = newRowHeight
        columnWidth = newColumnWidth
        rowCount = newRowCount
        columnCount = newColumnCount
      }
    }

    const Image = React.memo(({style, rowIndex, columnIndex}) => {
      let index = (rowIndex * columnCount) + columnIndex
      if(images.current[index]){
        let image = images.current[index]
        return (
          <div style={{...style, aspectRatio: `${currentProject.data.canvas.width}/${currentProject.data.canvas.height}`}}>
            <div className={styles.image} style={{backgroundColor: currentProject.data.canvas.background, width: '100%', height: '100%'}}>
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
    return (
      <div className={styles.imagesWrapper} id='imagesWrapper'>
        <Grid 
          rowCount={rowCount}
          columnCount={columnCount}
          height={window.innerHeight - 120}
          width={window.innerWidth}
          rowHeight={rowHeight + (((window.innerWidth - 6) / columnWidth) - Math.floor((window.innerWidth - 6) / columnWidth))*columnWidth/Math.floor((window.innerWidth - 6) / columnWidth)}
          columnWidth={columnWidth + (((window.innerWidth - 6) / columnWidth) - Math.floor((window.innerWidth - 6) / columnWidth))*columnWidth/Math.floor((window.innerWidth - 6) / columnWidth)}
        >
        {Image}
        </Grid>
      </div>
    )
  }else{
    return null
  }

})

const Footer = React.memo(({images, loading, setLoading}) => {

  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = projects.filter(i=>i.id===activeProject)[0]
  if(currentProject){
    useEffect(()=>{
      if(document.getElementById('total')){
        document.getElementById('total').innerHTML = currentProject.data.supply
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
            document.getElementById('progressIndicator').style.width = (((progress)/parseInt(currentProject.data.supply))*100)+'%'  
          }, 0)
        }
        const supplyImage = (i) => {
          if(i < parseInt(currentProject.data.supply)){
              let image = images.current[i]
              let div = document.createElement('div')
              let targetHTML = ReactDOMServer.renderToStaticMarkup(
                <div style={{backgroundColor: currentProject.data.canvas.background, position: 'relative', height: `${currentProject.data.canvas.height}px`, width: `${currentProject.data.canvas.width}px`}}>
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
              promises.push(
                new Promise(res=>{
                  document.getElementById('download').append(div)
                  setTimeout(()=>{
                    toJpeg(div.childNodes[0]).then((e)=>{
                      let a = document.createElement('a')
                      a.href = e
                      a.download = currentProject.data.name+'_#'+i+'.jpg'
                      document.getElementById('download').append(a)
                      setProgress().then(()=>{
                        a.click()
                        setTimeout(()=>{
                          document.getElementById('download').innerHTML = ''
                          supplyImage(i+1)
                          res()
                        }, 250)
                      })
                    })
                  }, 750)
                })
              )
          }else{
            Promise.all(promises).then(()=>{
              setLoading(false)
            }).catch(()=>{
              setLoading(true)
            })
          }
        }
        supplyImage(0)
    }
  
    const setModal = useSetRecoilState(modalAtom)
  
    const createNFT = () => {
      setModal({type: 'error', text: 'NFT creation is not available yet'})
    }

    const isMobile = window.innerWidth < 1200
  
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
          {!isMobile?
            <button className={styles.btn} onMouseDown={createNFT}>
                Create NFT Collection
            </button>
          :null}
        </div>
      </div>
    )
  }else{
    return null
  }
})

const Generate = () => {

  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = projects.filter(i=>i.id===activeProject)[0]
  if(currentProject){

    const displayLayers = Object.keys(currentProject.data.layers).sort((a, b)=>currentProject.data.layers[a].index-currentProject.data.layers[b].index)
    displayLayers.reverse()
  
    const images = useRef([])
  
    const setLoading = useSetRecoilState(loadingAtom)
  
    if(images.current.length === 0){
      for(let i = 0; i < parseInt(currentProject.data.supply); i++){
        let image = []
        for(let i = 0; i < displayLayers.length; i++){
          const random = Math.floor(Math.random() * (currentProject.data.layers[displayLayers[i]].assets.length - 1))
          image.push(currentProject.data.layers[displayLayers[i]].assets[random])
        }
        images.current.push(image)
        if(i === parseInt(currentProject.data.supply) - 1){
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
  }else{
    return <Navigate to='/dashboard' />
  }
}

export default React.memo(Generate)