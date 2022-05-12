const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


const validateJWT = async(req = request,res= response,next) => {
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'no token found in request'
        });
    }

    try {
        const {uid}= jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = req.user = await User.findById(uid);
        if(!user){
            return res.status(401).json({
                msg: 'invalid token'
            });
        }
        if(!user.status){
            return res.status(401).json({
                msg: 'invalid token'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'invalid token'
        });
    }

}


module.exports ={
    validateJWT
}