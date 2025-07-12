const express = require('express');
const router = express.Router();
const multer = require('multer');
const userscontroller = require('../Controllers/users_controller');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("File", file);
        cb(null, 'uploads/users'); 
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
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

router.route('/register')
    .post(upload.single('avatar'), userscontroller.Register);

router.route('/login')
    .post(userscontroller.Login);

router.route('/')
    .get(userscontroller.getAllUsers);

router.route('/:userId')
    .get(userscontroller.getUser)
    .patch(userscontroller.UpdateUser)
    .delete(userscontroller.deleteUser);

module.exports = router;
