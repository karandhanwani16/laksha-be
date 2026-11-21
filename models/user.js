const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
})

const User = mongoose.model('users', userSchema);

module.exports = User;