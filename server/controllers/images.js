import os from 'os'
import fs from 'fs'
import nodeHtmlToImage from 'node-html-to-image'

export const addImage = async (req, res) => {
    try {
        const folder = os.homedir()+'\\'+req.body.folder
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder)
        }
        let i = 0
        for(const image of req.body.images){
            console.log(image)
            nodeHtmlToImage({
                output: folder+'\\'+req.body.folder+i+'.jpg',
                html: image
            }).then(()=>{
                console.log('image created')
            })
            i++
        }
    } catch (error) {
        res.json({message: error.message})
    }
}