const bcrypt = require('bcryptjs')
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
const log = require('../../helpers/logger');

const createAdmin = async ({ adminInput: args }) => {
    log.event('Create Admin');
    try {
        const hashedPassword = await bcrypt.hash(args.password, 12);
        const dmin = new Admin({
            email: args.email,
            password: hashedPassword,
        });

        const savedAdmin = await admin.save();

        if (!savedAdmin) {
            log.error('Failed to create new admin: ' + args.email);
            throw new Error('[Create Admin] Could not save Admin!');
        }

        log.data('New Admin: ' + savedAdmin.email);

        return { ...savedAdmin._doc, password: null };

    } catch (err) {
        console.error(err);
        throw err;
    }
}

const login = async ({ email, password }) => {
    log.event('LOGIN');
    
    try {
        
        const admin = await Admin.findOne({ email: email });
        
        if (!admin) {
            log.error('admin does not exist:' + email);
            throw new Error('The credentials do not match');
        }
        
        const isValid = await bcrypt.compare(password, admin.password);
        
        if (!isValid) {
            log.error('Password does not match:' + email);
            throw new Error('The credentials do not match');
        }

        const payload = {
            adminId: admin.id,
            email: admin.email
        }

        const token = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '6h'});
        log.event('TOKEN GENERATED');
        log.data(`Admin ID: ${admin.id}`);
        return { adminId: admin.id, token: token, tokenExpiration: 1}

    } catch (err) {
        throw err;
    }
}

module.exports = {
    createAdmin,
    login
}