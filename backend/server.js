const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const userRoutes = require('./routes/userRoutes.js')
const employeeRoutes = require('./routes/employeeRoutes.js')

const DB_URL = "mongodb+srv://101485895_db_user:wJ9TVaA7Vyq3H7Wg@assignment2.ailycom.mongodb.net/comp3123_assignment2?appName=assignment2";
const PORT = 8081;

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("<h1>Laurence Liang 101485895 COMP3123 Assignment 2</h1>");
});

app.use('/api/v1', userRoutes);
app.use('/api/v1', employeeRoutes)

mongoose.connect(DB_URL)
.then(() => {
    console.log("Successfully connected to the database mongoDB Atlas Server");    
    app.listen(PORT, () => {
    console.log("Server is listening on port 8081");
});
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
