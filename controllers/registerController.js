const User = require("../models/userModel"); // Import User model

// Route to render the register page
const renderRegisterPage = (req, res) => {
    res.render("RegisterPage.ejs"); // Render the register page
};

// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // return res.status(400).send("User already exists.");
            return res.status(400).send(`
                <script>
                    alert("User already exists.");
                    window.location.href = "/login"; // redirect to login page after alert
                </script>
                `); // sends the error message as an alert box
        }

        // Create a new user
        const newUser = new User({ username, email, password });
        await newUser.save(); // Save user in the database
        
        // Redirect to login after successful registration
        res.redirect("/login");
    } catch (err) {
        res.status(500).send("Error registering user.");
    }
};

module.exports = {
    renderRegisterPage,   // Render register page
    registerUser,         // Register user route
};