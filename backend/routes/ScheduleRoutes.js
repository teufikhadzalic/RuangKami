const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/ScheduleControllers');

router.post("/create", scheduleController.createSchedule);
router.get("/student/:studentId", scheduleController.getStudentSchedule);
router.get("/:id", scheduleController.getScheduleById);
router.put("/:id", scheduleController.updateSchedule);
router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;