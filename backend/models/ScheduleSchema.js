const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student ID is required']
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required']
    },
    courseName: {
        type: String,
        required: [true, 'Course name is required']
    },
    instructor: {
        type: String,
        required: [true, 'Instructor name is required']
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: [true, 'Day of week is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
        validate: {
            validator: function(v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: props => `${props.value} is not a valid time format! Use HH:MM (24-hour format)`
        }
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        validate: {
            validator: function(v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: props => `${props.value} is not a valid time format! Use HH:MM (24-hour format)`
        }
    },
    location: {
        building: {
            type: String,
            required: [true, 'Building name is required']
        },
        roomNumber: {
            type: String,
            required: [true, 'Room number is required']
        }
    },
    semester: {
        type: String,
        required: [true, 'Semester is required']
    },
    academicYear: {
        type: String,
        required: [true, 'Academic year is required']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Compound index to ensure a student doesn't have overlapping schedules
ScheduleSchema.index({ 
    studentId: 1, 
    dayOfWeek: 1, 
    startTime: 1, 
    endTime: 1 
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = Schedule;