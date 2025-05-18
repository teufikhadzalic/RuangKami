const express = require('express');
const router = express.Router();
const taskController = require('../controllers/TaskControllers');

router.post("/addTask", taskController.addTask);
router.get("/listTasks", taskController.listTasks);
router.put("/updateTask/:id", taskController.updateTask);
router.delete("/deleteTask/:id", taskController.deleteTask);

module.exports = router;