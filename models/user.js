const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const LocalSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const GoogleSchema = new Schema({
    id: {
        type: String
    },
    email: {
        type: String,
        required: true
    }
});

const UserSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    local: {
        type: LocalSchema,
        required: false
    },
    google: {
        type: GoogleSchema,
        required: false
    },
    // facebook: {

    // }
});

UserSchema.pre('save', async function(next) {
    try {
        console.log('method:', this.method);
        if (this.method === 'local') {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(this.local.password, salt);
            this.local.password = hash;
        }
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model('user', UserSchema);

module.exports = User;