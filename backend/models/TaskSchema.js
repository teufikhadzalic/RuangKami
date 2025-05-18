const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    isDone: {
        type: Boolean,
        default: false
    },
    deadline: {
        type: Date,
        validate: {
            validator: function (value) {
                return !isNaN(Date.parse(value)) && value > Date.now();
            },
            message: 'Deadline must be in ISO 8601 format and in the future'
        }
    },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
