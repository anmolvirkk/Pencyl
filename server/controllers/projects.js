import os from 'os'
import fs from 'fs'

const writeOrReadData = async () => {
    let folder = os.homedir()+'\\downloads\\pencyl'
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    let file = folder+'\\data.json'
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({}))
    }
    return file
}

export const getProjects = async (_, res) => {
    try {
        writeOrReadData().then((data)=>{
            const projects = JSON.parse(fs.readFileSync(data))
            res.json(projects)
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        })
    } catch (error) {
        res.json({message: error.message})
    }
}

export const createProject = async (req, res) => {
    try {
        writeOrReadData().then((data)=>{
            const projects = JSON.parse(fs.readFileSync(data))
            let newProjects = {...projects, [req.body.id]: req.body}
            fs.writeFileSync(data, JSON.stringify(newProjects))
            res.json(newProjects)
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        })
    } catch (error) {
        res.json({message: error.message})
    }
}

export const getProjectById = async (req, res) => {
    try {
        writeOrReadData().then((data)=>{
            const projects = JSON.parse(fs.readFileSync(data))
            res.json(projects[req.body.id])
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        })
    } catch (error) {
        res.json({message: error.message})
    }
}

export const updateProject = async (req, res) => {
    try {
        writeOrReadData().then((data)=>{
            const projects = JSON.parse(fs.readFileSync(data))
            projects[req.body.id] = req.body
            fs.writeFileSync(data, JSON.stringify(projects))
            res.json(projects)
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        })
    } catch (error) {
        res.json({message: error.message})
    }
}

export const deleteProject = async (req, res) => {
    try {
        writeOrReadData().then((data)=>{
            const projects = JSON.parse(fs.readFileSync(data))
            const {[req.params.id]: remove, ...rest} = projects
            fs.writeFileSync(data, JSON.stringify(rest))
            res.json(rest)
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        })
    } catch (error) {
        res.json({message: error.message})
    }
}