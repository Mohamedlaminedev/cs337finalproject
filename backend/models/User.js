const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {  
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    balance: {
        type: Number,
        default: 0
    },
    budget: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

userSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        ret._id = ret._id.toString();
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
