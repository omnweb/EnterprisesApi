const jwt = require('jsonwebtoken');
const auth = require('../config/auth.json')
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).send({error: 'User is not logged in'})
    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2) {
        return res.status(401).send({error: 'Invalid Token'})
    } 

    const [scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({error: 'Token out of parameter'}) 
    }

    jwt.verify(token, auth.secret, (err, decoded) => {
        if (err) return res.status(401).send({error: "Token does not match."});
        req.userId = decoded.id;
        return next();
    })


}