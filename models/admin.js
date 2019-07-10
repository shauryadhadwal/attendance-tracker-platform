const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    batches: [{
        type: Schema.Types.ObjectId,
        ref: 'Batch'
    }],
});

module.exports = mongoose.model('Admin', adminSchema);