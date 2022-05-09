import React, { useRef, useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import activeProjectAtom from '../../../activeProjectAtom'
import projectsAtom from '../../../projectsAtom'
import Header from '../Header'
import styles from './_generate.module.sass'
import { FixedSizeGrid as Grid } from "react-window"
import ReactDOMServer from 'react-dom/server'
import { toJpeg } from 'dom-to-image'

const Images = React.memo(() => {

  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = JSON.parse(projects.filter(i=>i.id===activeProject)[0].project)
  let layerKeys = Object.keys(currentProject.layers)
  layerKeys.reverse()

  const images = useRef({})

  const [resize, setResize] = useState(false)
  window.onresize = () => {
    setResize(!resize)
  }

  const Image = React.memo(({style, columnIndex, rowIndex}) => {
    let index = 'image'+parseInt(`${columnIndex}${rowIndex}`)
    const randomNumbers = useRef([])
    if(!images.current[index]){
      let image = []
      for(let i = 0; i < layerKeys.length; i++){
        randomNumbers.current.push(Math.random())
        const random = Math.floor(randomNumbers.current[i] * (currentProject.layers[layerKeys[i]].assets.length - 1))
        image.push(currentProject.layers[layerKeys[i]].assets[random].elem)
      }
      images.current = {...images.current, [index]: image}
      return (
        <div className={styles.imageWrapper} style={{...style, aspectRatio: `${currentProject.canvas.width}/${currentProject.canvas.height}`}}>
          <div className={styles.image} style={{background: currentProject.canvas.background}}>
              {image.map((item, key)=>{
                return (
                  <div key={key} className={styles.asset}>
                    <img src={item} alt='' />
                  </div>
                )
              })}
          </div>
        </div>
      )
    }else{
      let image = images.current[index]
      return (
        <div style={{...style, aspectRatio: `${currentProject.canvas.width}/${currentProject.canvas.height}`}}>
          <div className={styles.image} style={{background: currentProject.canvas.background}}>
              {image.map((item, key)=>{
                return (
                  <div key={key} className={styles.asset}>
                    <img src={item} alt='' />
                  </div>
                )
              })}
          </div>
        </div>
      )
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
        columnWidth={300 + (((window.innerWidth - 2) / 300) - Math.floor((window.innerWidth - 2) / 300))*300/Math.floor((window.innerWidth - 2) / 300)}
      >
      {Image}
      </Grid>
    </div>
  )

})

const Footer = React.memo(() => {

  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = JSON.parse(projects.filter(i=>i.id===activeProject)[0].project)
  let layerKeys = Object.keys(currentProject.layers)
  layerKeys.reverse()

  useEffect(()=>{
    if(document.getElementById('total')){
      document.getElementById('total').innerHTML = currentProject.supply
    }
  }, [])

  const download = () => {
    for(let i = 0; i < parseInt(currentProject.supply); i++){
      setTimeout(()=>{
        document.getElementById('current').innerHTML = i + 1
        document.getElementById('progressIndicator').style.width = (((i + 1)/parseInt(currentProject.supply))*100)+'%'
        let image = []
        for(let i = 0; i < layerKeys.length; i++){
          const random = Math.floor(Math.random() * (currentProject.layers[layerKeys[i]].assets.length - 1))
          image.push(currentProject.layers[layerKeys[i]].assets[random].elem)
        }
        let div = document.createElement('div')
        div.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <div style={{background: currentProject.canvas.background, position: 'relative', height: '784px', width: '784px'}}>
              {image.map((item, key)=>{
                return (
                  <div key={key} style={{position: 'absolute', width: '100%'}}>
                    <img src={item} alt='' style={{width: '100%'}} />
                  </div>
                )
              })}
          </div>
        )
        document.getElementById('download').append(div)
        toJpeg(div.childNodes[0]).then((e)=>{
            if(e !== 'data:,'){
                fetch('http://localhost:5000/image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({folder: currentProject.name, image: e})
                }).then(e=>console.log(e))
            }
        })
      }, 0)
    }
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
            Export Zip
        </button>
        <button className={styles.btn}>
            Create NFT Collection
        </button>
      </div>
    </div>
  )
})

const Generate = () => {
  return (
    <div className={styles.generate}>
        <Header type='generate' />
        <Images />
        <Footer />
        <div id='download'></div>
    </div>
  )
}

export default React.memo(Generate)