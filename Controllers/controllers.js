const Course = require('../models/course.model');
const httpStatus = require('../utils/httpStatus');
let getCourses = async(req, res) => {
    
    const query = req.query;
    console.log(query);
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const Courses = await Course.find({},{"__v": false}).limit(limit).skip(skip);
    res.json({status: httpStatus.SUCCESS, data : {Courses}});
};

let getCourse = async(req,res)=>{
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).send({status:  httpStatus.FAIL, data :{ Course: "Course not found"}});
    res.json({status: httpStatus.SUCCESS, data: {course}});
};

let createCourse = async(req, res) =>{
    const {name, Price, image} = req.body;
   
    if(!name)
    {
        return json({status:httpStatus.FAIL, error: "Name not Provided."});
    }
    if(!Price)
    {
        return json({status: "fail", error: "Price not Provided."});
    }
    const newCourse = new Course({
        name, Price,
        image: req.file ? req.file.path : null,
    });
    await newCourse.save();
    res.status(201).json({status: httpStatus.SUCCESS, data: {course: newCourse}});
};

let updateCourse = async(req, res) => {
    const courseId = req.params.courseId;
    try{
        const UpdatedCourse = await Course.updateOne({courseId}, {$set:{ ...req.body}});
        res.status(201).json({status: httpStatus.SUCCESS, data: {course: UpdatedCourse}});
    }
    catch(err){
        res.status(400).json({status: httpStatus.ERROR, error: err.message});
    }
};

let deleteCourse = async(req, res) => {
    await Course.deleteOne({ _id: req.params.courseId});
    
    res.status(200).json({ status: httpStatus.SUCCESS, data: null });
};

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
};