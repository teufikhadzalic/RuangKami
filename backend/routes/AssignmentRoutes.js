const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/AssignmentController');
const auth = require('../middleware/Auth');
const upload = require('../middleware/upload');

// Rute spesifik dulu
router.get('/', auth, assignmentController.getAssignments);
router.post('/create', auth, assignmentController.createAssignment);

// Rute dinamis setelahnya
router.get('/:id', auth, assignmentController.getAssignmentById);
router.post('/:id/submit', auth, upload.single('file'), assignmentController.submitAssignment);
router.post('/:id/review', auth, assignmentController.reviewAssignment);

module.exports = router;