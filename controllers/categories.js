const { response,request } = require('express');
const {Category} = require('../models');


const getCategories = async(req,res = response) => {
    const{limit = 5, skip = 0} = req.query;

    const [total, categories] = await Promise.all([
        Category.countDocuments({status:true}),
        Category.find({status:true})
                            .populate('user','name')
                            .limit(Number(limit))
                            .skip(Number(skip))
    ]);

    res.json({total,categories});
}

const getCategory = async (req = request, res = response) => {
    const {id} = req.params;
    const category = await Category.findById(id).populate('user','name');
    res.status(201).json(category);
}

const postCategory = async(req,res = response) => {
    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({name});
    if(categoryDB){
        return res.status(400).json({
            msg: `Category ${categoryDB.name} already exists`
        });
    }
    const data = {
        name,
        user: req.user._id
    }
    const category = await new Category(data);

    await category.save();

    res.status(201).json(category);
}

const putCategory = async(req,res = response) => {
    const {id} = req.params;
    const {status,user,...data} = req.body;
    data.name = data.name.toUpperCase();
    data.user = req.user._id;
    const category = await Category.findByIdAndUpdate(id,data,{new:true});
    res.json(category);
}

const deleteCategory = async(req, res = response) => {
    const {id} = req.params;

    const category = await Category.findByIdAndUpdate(id,{status:false});
    const authenticatedUser = req.user;
    
    res.json({
        category,
        authenticatedUser
    });
}



module.exports = {
    postCategory,
    getCategories,
    getCategory,
    putCategory,
    deleteCategory,
}