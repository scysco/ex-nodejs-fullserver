const path = require('path');
const fs = require('fs');
const {uploadFile} = require('../helpers');

const {response,request} = require('express');

const {User, Product} = require('../models');


const upload = async(req = request,res = response) => {
    try {
        const name = await uploadFile(req.files, undefined, 'img');
        res.status(200).json({path:name});
    } catch (msg) {
        res.status(400).json({msg});
    }    
}

const updateImg = async(req = request,res = response) => {
    const {id,collection} = req.params;
    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if(!model){
                res.status(400).json({msg:'invalid id'});
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if(!model){
                res.status(400).json({msg:'invalid id'});
                
            }
            break;
    
        default:
            return res.status(500).json({msg:'unresolved answer'});
    }

    if(model.img){
        const pathImg = path.join(__dirname,'../uploads',collection,model.img);
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }
    }

    const name = await uploadFile(req.files, undefined, collection);
    model.img = name;
    await model.save();

    res.json({model});
}

const getImage = async(req = request,res = response) => {
    const {id,collection} = req.params;
    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if(!model){
                res.status(400).json({msg:'invalid id'});
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if(!model){
                res.status(400).json({msg:'invalid id'});
                
            }
            break;
    
        default:
            return res.status(500).json({msg:'unresolved answer'});
    }

    if(model.img){
        const pathImg = path.join(__dirname,'../uploads',collection,model.img);
        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg);
        }
    }

    const pathImg = path.join(__dirname,'../assets/no-image.jpg');
    res.sendFile(pathImg);
}

module.exports = {
    upload,
    updateImg,
    getImage,
}