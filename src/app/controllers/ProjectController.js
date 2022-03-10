const express = require('express');
const authMeddleware = require('../meddlewares/auth');
const router = express.Router();

router.use(authMeddleware);
router.get('/', (req, res) => {
    res.send({ok: true, user: req.userId});
})



module.exports = app => app.use('/projects', router)