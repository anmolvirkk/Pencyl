import os from 'os'
import fs from 'fs'

export const addImage = async (req, res) => {
    try {
        const folder = os.homedir()+'\\'+req.body.folder
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder)
        }
        const decodeBase64Image = async (dataString) => {
            var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
              response = {}
          
            if (matches.length !== 3) {
              return new Error('Invalid input string')
            }
          
            response.type = matches[1];
            response.data = Buffer.from(matches[2], 'base64')
          
            return response
        }
        decodeBase64Image(req.body.image).then((e)=>{
            fs.readdir(folder, (_, files) => {
                fs.writeFile(folder+'\\'+req.body.folder+'_#'+files.length+'.jpg', e.data, (err)=>{console.log(err)})
            })
        })
    } catch (error) {
        res.json({message: error.message})
    }
}