const { transformBatch } = require('./merge');
const Batch = require('../../models/batch');
const log = require('../../helpers/logger');
const mongoose = require('mongoose');

const batches = async () => {
    log.event('Fetch Batches');
    try {
        const batches = await Batch.find();
        return batches.map(batch => transformBatch(batch));
    } catch (error) {
        console.error(err);
        throw err;
    }
}

const createBatch = async (args, req ) => {
    log.event('Create Batch');
    // if(!req.isAuth){
    //     throw new Error('Not Authenticated!');
    // }
    try {
        const batchToSave = new Batch({
            name: args.name,
            members: []
        });

        let batch = await batchToSave.save();

        if (!batch) {
            throw new Error('[Create Batch] Could not save Batch')
        }

        log.data(`Batch: ${batch.name}`);

        return transformBatch(batch);

    } catch (err) {
        console.error(err);
        throw err;
    }
}

const addStudentToBatch = async (args, req) => {
    log.event('Add Student to Batch');
    // if(!req.isAuth){
    //     throw new Error('Not Authenticated!');
    // }
    try {

        const batchToModify = await Batch.findOne({_id: args.batchId});
        
        if (!batchToModify) {
            throw new Error('[Add Student to Batch] Could not get Batch')
        }

        batchToModify.members.push(mongoose.Types.ObjectId(args.studentId));
        const batch = await batchToModify.save();

        if (!batch) {
            throw new Error('[Add Student to Batch] Could not save Batch')
        }

        log.data(`Added: ${args.studentId} to Batch: ${args.batchId}`);

        return transformBatch(batch);

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
    batches,
    createBatch,
    addStudentToBatch
}