const { response, request} = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet = async(req = request, res = response) => {
    const{limit = 5, skip = 0} = req.query;

    const [total, users] = await Promise.all([
        User.countDocuments({status:true}),
        User.find({status:true})
                            .limit(Number(limit))
                            .skip(Number(skip))
    ]);

    res.json({total,users});
}

const usersPut = async (req = request, res = response) => {
    const {id} = req.params;
    const {_id,password,google,mail,...remainig} = req.body;
    
    //validate in db
    if (password) {
        const salt = bcryptjs.genSaltSync();
        remainig.password = bcryptjs.hashSync(password,salt);
    }

    const user = await User.findByIdAndUpdate(id,remainig);

    res.json(user);
}
const usersPost = async (req, res = response) => {

    const {name,mail,password,role,status} = req.body;
    const user = new User({name,mail,password,role,status});
    
    //hash passsword
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password,salt);
    //save db
    await user.save();
    res.json({
        msg: 'post api -controller',
        user,
    });
}
const usersDelete = async(req, res = response) => {
    const {id} = req.params;

    // const user = await User.findByIdAndDelete(id); --- delete database

    const user = await User.findByIdAndUpdate(id,{status:false});
    const authenticatedUser = req.user;
    
    res.json({
        user,
        authenticatedUser
    });
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
}