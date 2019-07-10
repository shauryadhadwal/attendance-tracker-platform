const DataLoader = require('dataLoader');
const Event = require('../../models/event');
const User = require('../../models/user');
const Student = require('../../models/student');
const Attendance = require('../../models/attendance');
const Batch = require('../../models/batch');
const log = require('../../helpers/logger');

const StudentLoader = new DataLoader((studentIds) => {
    log.event('Student Loader');
    return Student.find({_id: {$in: studentIds}});
}); 

const BatchLoader = new DataLoader((batchIds) => {
    log.event('Batch Loader');
     return Batch.find({_id: {$in: batchIds}});
});

const transformStudent = student => {
    return {
        ...student._doc,
        batches: () => getBatchesOfStudent(student.id)
    }
}

const transformAttendance = attendance => {
    return {
        ...attendance._doc,
        student: () => getStudentById(attendance.student.toString()),
        batch: () => getBatchById(attendance.batch.toString())
    }
}

const transformBatch = batch => {
    return {
        ...batch._doc,
        members: () => getStudentsByIds(batch._doc.members)
    }
}

const getBatchesOfStudent = async (studentId) => {
    const batches = await Batch.find({members: { $in : [studentId] }});
    return batches.map(batch => transformBatch(batch));
}

const getStudentsByIds = async (studentIds) => {
    try {
        const students = await Student.find({_id: {$in: [studentIds]}});

        if (!studentIds) {
            throw new Error('[GET student] students not found!');
        }
        return students.map(student => transformStudent(student));

    } catch (err) {
        console.error(err);
        throw new err;
    }
}

const getStudentById = async (studentId) => {
    try {
        const student = await StudentLoader.load(studentId.toString());

        if (!student) {
            throw new Error('[GET student] student not found!');
        }
        return student;

    } catch (err) {
        console.error(err);
        throw new err;
    }
}

const getAttendanceById = async (studentId, batchId) => {
    try {
        const attendances = await Attendance.find({student: studentId, batch: batchId});

        if (!student) {
            throw new Error('[GET attendances] attendances not found!');
        }
        return attendances;

    } catch (err) {
        console.error(err);
        throw new err;
    }
}

const getBatchById = async (batchId) => {
    try {
        const batch = await BatchLoader.load(batchId);

        if (!batch) {
            throw new Error('[GET batch] batch not found!');
        }
        return transformBatch(batch);

    } catch (err) {
        console.error(err);
        throw new err;
    }
}

module.exports = {
    transformAttendance,
    transformBatch,
    transformStudent,
}