const User = require('../models/user_model');
const generateJWT = require('../utils/generateJWT');
const httpStatus = require('../utils/httpStatus');
const bcrypt = require('bcrypt');

let getAllUsers = async (req, res) => {
    const query = req.query;
    const limit = parseInt(query.limit) || 10;
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * limit;

    const Users = await User.find({}, { "__v": false, "password": 0 })
        .limit(limit)
        .skip(skip);

    res.json({ status: httpStatus.SUCCESS, data: { Users } });
};

let getUser = async (req, res, next) => {
    const user = await User.findById(req.params.userId, { "__v": false, "password": 0 });
    if (!user) {
        return res.status(404).json({
            status: httpStatus.FAIL,
            data: { user: "User not found" }
        });
    }
    res.status(200).json({ status: httpStatus.SUCCESS, data: { user } });
};

let UpdateUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const updated = await User.updateOne({ _id: userId }, { $set: { ...req.body } });
        res.status(200).json({
            status: httpStatus.SUCCESS,
            data: { updated }
        });
    } catch (err) {
        res.status(404).json({ status: httpStatus.FAIL, error: "User not found" });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        await User.deleteOne({ _id: userId });
        res.status(200).json({
            status: httpStatus.SUCCESS,
            data: "User deleted successfully"
        });
    } catch (err) {
        res.status(404).json({
            status: httpStatus.FAIL,
            error: "User not found"
        });
    }
};

let Register = async (req, res) => {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({
            status: httpStatus.FAIL,
            error: "fullname or email or password is required."
        });
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
        return res.status(400).json({
            status: httpStatus.FAIL,
            error: "Email already exists."
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
        role,
        avatar: req.file?.filename || null
    });

    const token = generateJWT({
        email: newUser.email,
        id: newUser._id,
        role: newUser.role
    });

    newUser.token = token;

    await newUser.save();

    res.status(201).json({
        status: httpStatus.SUCCESS,
        message: "User registered successfully.",
        data: {
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role,
                avatar: newUser.avatar,
                token: newUser.token
            }
        }
    });
};

let Login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: httpStatus.FAIL,
            error: "Email and password are required."
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            status: httpStatus.FAIL,
            message: "User not found"
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({
            status: httpStatus.FAIL,
            message: "Invalid email or password"
        });
    }

    const token = generateJWT({
        email: user.email,
        id: user._id,
        role: user.role
    });

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: { token }
    });
};

module.exports = {
    getAllUsers,
    getUser,
    UpdateUser,
    deleteUser,
    Register,
    Login
};
