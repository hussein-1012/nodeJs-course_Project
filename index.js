require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const coursesRoutes = require('./Routes/courses-rout');
const usersRouter = require('./Routes/users_route');

const app = express();
const url = process.env.MONGO_URL;

app.use('/uploads/users', express.static(path.join(__dirname, 'uploads/users')));
app.use('/uploads/courses', express.static(path.join(__dirname, 'uploads/courses')));

app.use(cors());

app.use(express.json());

mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB Server');
});


app.use('/api/courses', coursesRoutes);
app.use('/api/users', usersRouter);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
