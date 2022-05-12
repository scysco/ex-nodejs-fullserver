const { request, response } = require('express');

const isAdminRole = (req= request, res = response, next) =>{
    if(!req.user){
        return res.status(500).json({
            msg:'the token must be validated first'
        });
    }

    const{role,name} = req.user;

    if (role != 'ADMIN_ROLE') {
        return res.status(401).json({
            msg:'unauthorized user'
        });
    }
    next();
}


const validateRole = (...roles) =>{
    return (req= request, res = response, next) =>{
        if(!req.user){
            return res.status(500).json({
                msg:'the token must be validated first'
            });
        }
        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                msg:'unauthorized user'
            });
        }
        next();
    }

}

module.exports = {
    validateRole,
    isAdminRole
}