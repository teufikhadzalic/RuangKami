const Assignment = require('../models/Assignment');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Create a new assignment (only pemimpin)
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, division, dueDate } = req.body;

    const assignment = new Assignment({
      title,
      description,
      division,
      dueDate,
      createdBy: req.user.id
    });

    await assignment.save();

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all assignments based on user role
exports.getAssignments = async (req, res) => {
  try {
    let assignments;

    // Pemimpin can see all assignments
    if (req.user.role === 'pemimpin') {
      assignments = await Assignment.find()
        .populate('createdBy', 'name')
        .populate('submission.submittedBy', 'name');
    } 
    // Division leaders and members can only see assignments for their division
    else {
      assignments = await Assignment.find({ division: req.user.division })
        .populate('createdBy', 'name')
        .populate('submission.submittedBy', 'name');
    }

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('submission.submittedBy', 'name');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user has access to this assignment
    if (req.user.role !== 'pemimpin' && assignment.division !== req.user.division) {
      return res.status(403).json({ message: 'Not authorized to access this assignment' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Get assignment by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit assignment (only pemimpin_divisi)
exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user is a division leader of the same division
    if (req.user.role !== 'pemimpin_divisi' || assignment.division !== req.user.division) {
      return res.status(403).json({ message: 'Not authorized to submit this assignment' });
    }

    // Check if assignment is already submitted
    if (assignment.status !== 'assigned') {
      return res.status(400).json({ message: 'Assignment has already been submitted' });
    }

    // Handle file upload
    let filePath = null;
    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
    } else if (!req.body.content) {
      return res.status(400).json({ message: 'Either file or content is required for submission' });
    }

    // Update assignment
    assignment.status = 'submitted';
    assignment.submission = {
      content: req.body.content || '',
      submittedBy: req.user.id,
      submittedAt: Date.now(),
      file: filePath
    };

    await assignment.save();

    res.json(assignment);
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Review assignment submission (only pemimpin)
exports.reviewAssignment = async (req, res) => {
  try {
    const { feedback } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user is a pemimpin
    if (req.user.role !== 'pemimpin') {
      return res.status(403).json({ message: 'Not authorized to review assignments' });
    }

    // Check if assignment has been submitted
    if (assignment.status !== 'submitted') {
      return res.status(400).json({ message: 'Assignment has not been submitted yet' });
    }

    // Update assignment
    assignment.status = 'reviewed';
    assignment.feedback = feedback;

    await assignment.save();

    res.json(assignment);
  } catch (error) {
    console.error('Review assignment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};