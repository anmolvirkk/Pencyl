import React, { useRef } from 'react'
import { useRecoilState } from 'recoil'
import activeProjectAtom from '../../../activeProjectAtom'
import projectsAtom from '../../../projectsAtom'
import Header from '../Header'
import styles from './_generate.module.sass'
import { FixedSizeGrid as Grid } from "react-window"

const Images = React.memo(() => {

  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = JSON.parse(projects.filter(i=>i.id===activeProject)[0].project)
  let layerKeys = Object.keys(currentProject.layers)
  layerKeys.reverse()

  const images = useRef({})

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
        columnWidth={300}
      >
      {Image}
      </Grid>
    </div>
  )

})

const Footer = React.memo(() => {
  return (
    <div className={styles.footer} id='footer'>
      <div className={styles.progressbar}>
        <div className={styles.progress} id='progress' />
      </div>
      <div className={styles.btns}>
        <button className={styles.btn}>
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
    </div>
  )
}

export default React.memo(Generate)