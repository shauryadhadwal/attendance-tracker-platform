const adminResolver= require('./admin');
const batchResolver= require('./batch');
const studentResolver = require('./student');
const attendanceResolver = require('./attendance');

module.exports = {
    ...adminResolver,
    ...batchResolver,
    ...studentResolver,
    ...attendanceResolver
}