const express = require('express');
const User = require('../models/user');
const userRouter = express.Router();

userRouter.post('/user/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        const saved = await user.save();

        res.status(201).json({
            message: "User created successfully.",
            user_id: saved._id
        });

    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            return res.status(400).json({
                message: "Email already in use."
            });
        }

        res.status(500).json({ message: err.message });
    }
});

userRouter.post('/user/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email, and password are required."
            });
        }

        const existing = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existing) {
            return res.status(400).json({
                message: "Username or email is already in use."
            });
        }

        const user = new User({ username, email, password });
        const saved = await user.save();

        res.status(201).json({
            message: "User created successfully.",
            user_id: saved._id
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = userRouter;