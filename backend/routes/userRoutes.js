const express = require('express');
const User = require('../models/user');
const userRouter = express.Router();

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

        const newUser = new User({ username, email, password });
        const saved = await newUser.save();

        res.status(201).json({
            message: "User created successfully.",
            user_id: saved._id
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

userRouter.post('/user/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!password || (!username && !email)) {
            return res.status(400).json({
                message: "Username/email and password are required."
            });
        }

        const user = await User.findOne({
            $or: [{ username }, { email }]
        }).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const match = await user.isValidPassword(password);
        if (!match) {
            return res.status(401).json({ message: "Invalid password." });
        }

        res.status(200).json({
            message: "Login successful",
            token: "dummy-token"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = userRouter;
