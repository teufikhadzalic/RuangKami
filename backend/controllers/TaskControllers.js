const Task = require('../models/TaskSchema');
const mongoose = require('mongoose');

exports.addTask = async (req, res) => {
    const { title, description, isDone, deadline } = req.body;
    const task = new Task({ title, description, isDone, deadline });
    try {
        await task.save();
        res.status(201).json({ message: "Task successfully added", data: task });
    } catch (err) {
    let errorMessage = "Error updating task";

    if (err.name === "CastError" && err.path === "deadline") {
        errorMessage = "Deadline must be a valid ISO 8601 date string";
    } else if (err.name === "ValidationError") {
        const fieldErrors = Object.values(err.errors).map(e => e.message);
        errorMessage = fieldErrors.join(", ");
    }

    res.status(400).json({ message: errorMessage, error: err.message });
    }
};

exports.listTasks = async (req, res) => {
    try {
        const taskList = await Task.find();
        res.status(200).json({ message: "Task list retrieved successfully", data: taskList });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving tasks", error: err });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
    }

    const allowedFields = ["title", "description", "isDone", "deadline"];
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
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task successfully updated", data: updatedTask });
    } catch (err) {
        res.status(400).json({ message: "Error updating task", error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task successfully deleted", data: deletedTask });
    } catch (err) {
        res.status(500).json({ message: "Error deleting task", error: err });
    }
};