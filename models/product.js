const {Schema, model} = require('mongoose');

const ProductSchema = Schema({
    name:{
        type: String,
        required: [true, 'name is required'],
        unique: true,
    },
    status:{
        type: Boolean,
        default: true,
        required: true,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user is required']
    },
    price:{
        type: Number,
        default: 0,
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'category is required']
    },
    description:{
        type: String
    },
    availability:{
        type: Boolean,
        default: true,
    },
    img:{type:String},
});

ProductSchema.methods.toJSON = function(){
    const {__v, status, _id, ...data} = this.toObject();
    data.id = _id;
    return data;
}

module.exports = model('Product',ProductSchema);