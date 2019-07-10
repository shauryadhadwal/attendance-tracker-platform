const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const batchSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Batch',
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Student',
    }]
});

module.exports = mongoose.model('Batch', batchSchema);