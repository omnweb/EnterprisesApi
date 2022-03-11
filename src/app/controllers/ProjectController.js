const express = require('express');
const authMeddleware = require('../meddlewares/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');

const router = express.Router();

router.use(authMeddleware);

// Insert Project
router.post('/', async (req, res) => {
    try {
        const {title, description, tasks} = req.body;
        const project = await Project.create({title, description, user: req.userId});

        await Promise.all(tasks.map (async task => {
            const projectTask = new Task({...task, project: project._id });
            await projectTask.save()
            project.tasks.push(projectTask);
        }));
        await project.save();
        return res.send({ project });
    } catch (error) {
        res.status(400).send({error: 'Error creating new project'});
    }
});

// List the projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks']);
        return res.send({ projects });

    } catch (error) {
        res.status(400).send({error: 'Error listing projects'});
    }
});

// Get a specific project
router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);
        return res.send({ project });

    } catch (error) {
        res.status(400).send({error: 'Error listing user projects'});
    }
});
// Change a project
router.put('/:projectId', async (req, res) => {
    try {
        const {title, description, tasks} = req.body;
        const project = await Project.findByIdAndUpdate(req.params.projectId, {
            title, 
            description
        }, {new: true}); // For mongose ​​to return the updated project]

        
        // remove tasks to create them again
        project.tasks = [];
        await Task.deleteOne({projectId: project._id})

        await Promise.all(tasks.map (async task => {
            const projectTask = new Task({...task, project: project._id });
            await projectTask.save()
            project.tasks.push(projectTask);
        }));
        await project.save();
        return res.send({ project });
    } catch (error) {
        res.status(400).send({error: 'Error update user project'});
    }
});

// Remove a project
router.delete('/:projectId', async (req, res) => {
    try {
        const project = await Project.findByIdAndRemove(req.params.projectId);
        return res.send('The project has been removed');

    } catch (error) {
        res.status(400).send({error: 'Error removing project'});
    }
});




module.exports = app => app.use('/projects', router)