const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {type: String, required: [true, 'Username is required'], trim: true},
    password: {type: String, required: [true, 'Password is required'], trim: true, select: false}, 
    email: {type: String, required: [true, 'Email is required'], unique: true, trim: true},
    created_at: {type: Date, default: Date.now},
    updated_at:{type: Date, default: Date.now}
})

userSchema.pre('save', async function (next) {
    this.updated_at = Date.now();

    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    
    next();
});

userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updated_at: Date.now() });
    next();
});

module.exports = mongoose.model('User', userSchema);