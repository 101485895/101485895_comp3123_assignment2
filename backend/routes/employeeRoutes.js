const express = require('express');
const Employee = require('../models/employee.js');
const employeeRouter = express.Router();

employeeRouter.get('/emp/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve employees." });
    }
});

employeeRouter.post('/emp/employees', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        const saved = await employee.save();

        res.status(201).json({
            message: "Employee created successfully.",
            employee_id: saved._id
        });

    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            return res.status(400).json({
                message: "Email already in use."
            });
        }

        res.status(500).json({
            message: "Failed to create employee."
        });
    }
});

employeeRouter.get('/emp/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee)
            return res.status(404).json({ message: "Employee not found." });

        res.status(200).json(employee);

    } catch (err) {
        res.status(400).json({ message: "Invalid employee ID." });
    }
});

employeeRouter.put('/emp/employees/:id', async (req, res) => {
    try {
        const updated = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Employee not found." });

        res.status(200).json({
            message: "Employee updated successfully."
        });

    } catch (err) {
        res.status(400).json({ message: "Invalid update request." });
    }
});

employeeRouter.delete('/emp/employees', async (req, res) => {
    try {
        const employeeId = req.query.eid;

        if (!employeeId)
            return res.status(400).json({ message: "Employee ID is required." });

        const deleted = await Employee.findByIdAndDelete(employeeId);

        if (!deleted)
            return res.status(404).json({ message: "Employee not found." });

        res.status(204).send();

    } catch (err) {
        res.status(400).json({ message: "Invalid employee ID." });
    }
});

employeeRouter.get('/emp/search', async (req, res) => {
    try {
        const { department, position } = req.query;

        let query = {};

        if (department) {
            query.department = { $regex: department, $options: "i" };
        }

        if (position) {
            query.position = { $regex: position, $options: "i" };
        }

        const results = await Employee.find(query);
        res.status(200).json(results);

    } catch (err) {
        res.status(500).json({ message: "Failed to perform search." });
    }
});

module.exports = employeeRouter;