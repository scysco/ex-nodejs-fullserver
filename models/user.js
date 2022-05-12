const {Schema, model} = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    mail: {
        type: String,
        required : [true, 'mail is required'],
        unique: true,
    },
    password: {
        type: String,
        required : [true, 'password is required'],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required : [true, 'role is required'],
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE','USER_ROLE','SALES_ROLE'],
    },
    status: {
        type: Boolean,
        default : true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

UserSchema.methods.toJSON = function(){
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
    //return {...user, uid:_id};
}

module.exports = model('User',UserSchema);