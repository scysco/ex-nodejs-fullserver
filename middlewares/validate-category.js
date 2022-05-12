const { request, response } = require('express');
const { Category } = require('../models');

const validateCategory = async(req= request, res = response, next) =>{
    const categoryId = req.body.category;
    const category = await Category.findById(categoryId);

    if(!category){
        return res.status(401).json({
            msg: 'invalid token'
        });
    }
    if(!category.status){
        return res.status(401).json({
            msg: 'invalid token'
        });
    }
    req.category = category;
    next();
}

module.exports = {
    validateCategory
}