const express = require('express');
const Employee = require('../models/employee.js');
const employeeRouter = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

employeeRouter.get('/emp/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch {
    res.status(500).json({ message: "Failed to retrieve employees." });
  }
});

employeeRouter.post('/emp/employees', upload.single("profile_picture"), async (req, res) => {
  try {
    const employeeData = req.body;
    if (req.file) employeeData.profile_picture = req.file.filename;

    const employee = new Employee(employeeData);
    const saved = await employee.save();

    res.status(201).json({
      message: "Employee created successfully.",
      employee_id: saved._id
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ message: "Email already in use." });
    }
    res.status(500).json({ message: "Failed to create employee." });
  }
});

employeeRouter.get('/emp/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found." });
    res.status(200).json(employee);
  } catch {
    res.status(400).json({ message: "Invalid employee ID." });
  }
});

employeeRouter.put('/emp/employees/:id', upload.single("profile_picture"), async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.file) updatedData.profile_picture = req.file.filename;

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Employee not found." });
    res.status(200).json({ message: "Employee updated successfully." });
  } catch {
    res.status(400).json({ message: "Invalid update request." });
  }
});

employeeRouter.delete('/emp/employees', async (req, res) => {
  try {
    const employeeId = req.query.eid;
    if (!employeeId) return res.status(400).json({ message: "Employee ID is required." });

    const deleted = await Employee.findByIdAndDelete(employeeId);
    if (!deleted) return res.status(404).json({ message: "Employee not found." });

    res.status(204).send();
  } catch {
    res.status(400).json({ message: "Invalid employee ID." });
  }
});

employeeRouter.get("/emp/search", async (req, res) => {
  try {
    const { department, position } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (position) filter.position = position;

    const results = await Employee.find(filter);
    res.status(200).json(results);
  } catch {
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = employeeRouter;
