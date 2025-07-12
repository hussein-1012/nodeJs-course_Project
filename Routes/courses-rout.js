const express = require('express');
const router = express.Router();
const multer = require('multer');

const UserRoles = require('../utils/roles');
const coursesController = require('../Controllers/controllers');
const allowedTo = require('../middlewares/allowedTo');
const verifyUserFromBody = require('../middlewares/VerifyUserFormBody');

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File", file);
    cb(null, 'uploads/courses');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const fileName = `course-${Date.now()}.${ext}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split('/')[0];
  if (imageType === 'image') {
    cb(null, true);
  } else {
    cb(new Error('File must be an image'), false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter });

router
  .route('/')
  .get(coursesController.getCourses)
  .post(upload.single('image'), coursesController.createCourse);

router
  .route('/:courseId')
  .get(coursesController.getCourse)
  .patch(coursesController.updateCourse)
  .delete(
    verifyUserFromBody,
    allowedTo(UserRoles.ADMIN, UserRoles.MANAGER),
    coursesController.deleteCourse
  );

module.exports = router;
