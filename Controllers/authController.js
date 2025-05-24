const User = require("../Models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
     let user = await User.findOne({ $or :[{username},{email }] });
     if (user) {
         return res.status(400).json({ message: "Username or email already exists" });
     
     }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
     
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error(error);
    }
};

exports.login = async (req, res) => {
    res.status(200).json({ message: "Login route working" });
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, userId: user._id, username: user.username });

    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
