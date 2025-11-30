const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    position: {type: String, required: true},
    salary: {type: Number, default: 0, min: 0},
    date_of_joining: {type: Date, required: true},
    department: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at:{type: Date, default: Date.now}
})

employeeSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.__v;
        delete ret.created_at;
        delete ret.updated_at;
        return ret;
    }
});

employeeSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

employeeSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updated_at: Date.now() });
    next();
});

module.exports = mongoose.model('employee', employeeSchema);