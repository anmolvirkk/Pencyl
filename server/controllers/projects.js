import Project from "../models/projectModel.js"

export const getProjects = async (_, res) => {
    try {
        const projects = await Project.findAll()
        res.json(projects)
    } catch (error) {
        res.json({message: error.message})
    }
}

export const createProject = async (req, res) => {
    try {
        await Project.create(req.body)
        const projects = await Project.findAll()
        res.json(projects)
    } catch (error) {
        res.json({message: error.message})
    }
}

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findAll({
            where: {
                id: req.params.id
            }
        })
        res.json(project[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

export const updateProject = async (req, res) => {
    try {
        await Project.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        const projects = await Project.findAll()
        res.json(projects)
    } catch (error) {
        res.json({message: error.message})
    }
}

export const deleteProject = async (req, res) => {
    try {
        await Project.destroy({
            where: {
                id: req.params.id
            }
        })
        const projects = await Project.findAll()
        res.json(projects)
    } catch (error) {
        res.json({message: error.message})
    }
}