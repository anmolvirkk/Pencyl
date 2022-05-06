import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import activeProjectAtom from '../../../activeProjectAtom'
import projectsAtom from '../../../projectsAtom'
import Header from '../Header'
import styles from './_generate.module.sass'
import ReactDOMServer from 'react-dom/server'

const Images = () => {
  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = JSON.parse(projects.filter(i=>i.id===activeProject)[0].project)
  useEffect(()=>{
    if(document.getElementById('images').children.length < parseInt(currentProject.supply)){
      for(let i = 0; i<parseInt(currentProject.supply); i++){
        setTimeout(()=>{
          let image = []
          let layerKeys = Object.keys(currentProject.layers)
          layerKeys.reverse()
          layerKeys.forEach((item)=>{
            let random = Math.floor(Math.random() * (currentProject.layers[item].assets.length - 1))
            image.push(currentProject.layers[item].assets[random].elem)
          })
          const html = ReactDOMServer.renderToStaticMarkup(
            <div key={i} className={styles.imageWrapper} style={{aspectRatio: `${currentProject.canvas.width}/${currentProject.canvas.height}`}}>
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
          document.getElementById('images').innerHTML = document.getElementById('images').innerHTML+html
          window.scrollTo(0, document.body.scrollHeight)
        }, 0)
      }
    }
  }, [currentProject])
  return (
    <div className={styles.images} id='images' />
  )
}

const Generate = () => {
  return (
    <div className={styles.generate}>
        <Header type='generate' />
        <Images />
    </div>
  )
}

export default Generate