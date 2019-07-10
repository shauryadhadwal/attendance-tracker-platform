const Student = require('../../models/student');
const { transformStudent } = require('./merge');
const log = require('../../helpers/logger');

const students = async () => {
    log.event('Fetch Students');
    try {
        const students = await Student.find();
        return students.map(student => transformStudent(student));
    } catch (error) {
        console.error(err);
        throw err;
    }
}

const createStudent = async ({ studentInput: args, req: req }) => {
    log.event('Create Student');
    // if(!req.isAuth){
    //     throw new Error('Not Authenticated!');
    // }
    log.data(args.email);
    try {
        const studentToSave = new Student({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            phone: args.phone,
        });

        let student = await studentToSave.save();

        if (!student) {
            throw new Error('[Create Student] Could not save Student!')
        }

        log.data(`Student: ${student.firstName}`);
        
        return transformStudent(student);

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
    students,
    createStudent,
}