const Attendance = require('../../models/attendance');
const log = require('../../helpers/logger');
const { transformAttendance } = require('./merge');

const attendances = async ({req: req, studentId: studentId, batchId: batchId}) => {
    log.event('Fetch Attendances');

    // if(!req.isAuth){
    //     throw new Error('Not Authenticated!');
    // }

    try {
        const attendances = await Attendance.find({student: studentId, batch: batchId });
        return attendances.map(attendance => transformAttendance(attendance));
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const createAttendance = async ({attendanceInput: args, req: req}) => {
    log.event('Create Attendance');
    
    // if(!req.isAuth){
    //     throw new Error('Not Authenticated!');
    // }

    try {
        const attendanceToSave = await new Attendance({
            student: args.studentId,
            batch: args.batchId,
            year: args.year,
            month: args.month,
            day: args.day,
            present: args.present,
            comment: args.comment
        });

        const attendance = await attendanceToSave.save();

        return attendance;
        
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const cancelBooking = async (args, req) => {
    log.event('CANCEL BOOKING');
    log.data(args.bookingId);

    if(!req.isAuth){
        throw new Error('Not Authenticated!');
    }
    try {
        const booking = await Booking.findOne({ _id: args.bookingId }).populate('event');

        await Booking.deleteOne({ _id: args.bookingId });

        return transformEvent(booking.event);

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
    attendances,
    createAttendance,
}