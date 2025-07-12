const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    image:
    {
        type: String,
    }
}, { collection: 'Courses' });

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
