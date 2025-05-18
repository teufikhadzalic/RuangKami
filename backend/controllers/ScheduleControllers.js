const Schedule = require('../models/ScheduleSchema');
const mongoose = require('mongoose');

exports.createSchedule = async (req, res) => {
    const { 
        studentId, 
        courseId, 
        courseName, 
        instructor, 
        dayOfWeek, 
        startTime, 
        endTime, 
        location, 
        semester, 
        academicYear 
    } = req.body;
    
    // Check for time conflicts
    try {
        const conflictingSchedule = await Schedule.findOne({
            studentId,
            dayOfWeek,
            isActive: true,
            $or: [
                // New schedule starts during an existing schedule
                {
                    startTime: { $lte: startTime },
                    endTime: { $gt: startTime }
                },
                // New schedule ends during an existing schedule
                {
                    startTime: { $lt: endTime },
                    endTime: { $gte: endTime }
                },
                // New schedule completely contains an existing schedule
                {
                    startTime: { $gte: startTime },
                    endTime: { $lte: endTime }
                }
            ]
        });
        
        if (conflictingSchedule) {
            return res.status(400).json({ 
                message: "Schedule conflicts with an existing class", 
                conflictWith: conflictingSchedule 
            });
        }
        
        const schedule = new Schedule({
            studentId,
            courseId,
            courseName,
            instructor,
            dayOfWeek,
            startTime,
            endTime,
            location,
            semester,
            academicYear
        });
        
        await schedule.save();
        res.status(201).json({ message: "Schedule successfully created", data: schedule });
    } catch (err) {
        let errorMessage = "Error creating schedule";

        if (err.name === "ValidationError") {
            const fieldErrors = Object.values(err.errors).map(e => e.message);
            errorMessage = fieldErrors.join(", ");
        }

        res.status(400).json({ message: errorMessage, error: err.message });
    }
};

exports.getStudentSchedule = async (req, res) => {
    const { studentId } = req.params;
    const { semester, academicYear } = req.query;
    
    const query = { studentId, isActive: true };
    
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;
    
    try {
        const schedules = await Schedule.find(query).sort({ dayOfWeek: 1, startTime: 1 });
        res.status(200).json({ 
            message: "Student schedule retrieved successfully", 
            data: schedules 
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving schedule", error: err.message });
    }
};

exports.getScheduleById = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid schedule ID" });
    }
    
    try {
        const schedule = await Schedule.findById(id);
        
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        
        res.status(200).json({ 
            message: "Schedule retrieved successfully", 
            data: schedule 
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving schedule", error: err.message });
    }
};

exports.updateSchedule = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid schedule ID" });
    }
    
    const allowedFields = [
        "courseName", 
        "instructor", 
        "dayOfWeek", 
        "startTime", 
        "endTime", 
        "location", 
        "isActive"
    ];
    
    const updates = {};
    
    allowedFields.forEach(field => {
        if (req.body.hasOwnProperty(field)) {
            updates[field] = req.body[field];
        }
    });
    
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update." });
    }
    
    try {
        // If updating time, check for conflicts
        if (updates.dayOfWeek || updates.startTime || updates.endTime) {
            const currentSchedule = await Schedule.findById(id);
            
            if (!currentSchedule) {
                return res.status(404).json({ message: "Schedule not found" });
            }
            
            const dayOfWeek = updates.dayOfWeek || currentSchedule.dayOfWeek;
            const startTime = updates.startTime || currentSchedule.startTime;
            const endTime = updates.endTime || currentSchedule.endTime;
            
            const conflictingSchedule = await Schedule.findOne({
                _id: { $ne: id }, // Exclude current schedule
                studentId: currentSchedule.studentId,
                dayOfWeek,
                isActive: true,
                $or: [
                    { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
                    { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
                    { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
                ]
            });
            
            if (conflictingSchedule) {
                return res.status(400).json({ 
                    message: "Updated schedule conflicts with an existing class", 
                    conflictWith: conflictingSchedule 
                });
            }
        }
        
        const updatedSchedule = await Schedule.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );
        
        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        
        res.status(200).json({ 
            message: "Schedule successfully updated", 
            data: updatedSchedule 
        });
    } catch (err) {
        res.status(400).json({ message: "Error updating schedule", error: err.message });
    }
};

exports.deleteSchedule = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid schedule ID" });
    }
    
    try {
        const deletedSchedule = await Schedule.findByIdAndDelete(id);
        
        if (!deletedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        
        res.status(200).json({ 
            message: "Schedule successfully deleted", 
            data: deletedSchedule 
        });
    } catch (err) {
        res.status(500).json({ message: "Error deleting schedule", error: err.message });
    }
};