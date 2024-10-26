const User = require("../models/userModel"); // Import User model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");

// Route to render the login page
const renderLoginPage = (req, res) => {
    res.render("LoginPage.ejs"); // Render the login page
};

// Login user and generate JWT token
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Enter a valid Email/Password");
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // return window.alert("All fields are required");
            return res.status(400).send("Incorect email or password.");
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        // Set token in cookies (or you can set it in headers)
        res.cookie("token", token, { httpOnly: true });
        
        // Redirect to the home page after successful login
        res.redirect("/");
        console.log("Login succesful")
    } catch (err) {
        console.log(err);
        // res.status(500).send("Error logging in.");
    }
};

// Logout and clear the JWT token
const logoutUser = (req, res) => {
    res.clearCookie("token"); // Clear token from cookies
    res.redirect("/login"); // Redirect to the login page
};

module.exports = {
    renderLoginPage,      // Render login page
    loginUser,            // Login user route
    logoutUser            // Logout route
};