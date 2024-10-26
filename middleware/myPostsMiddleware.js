// this middleware makes the my posts page have authorization to delete and edit/update posts 
// it also makes the homepage able use the user.username 

const jwt = require("jsonwebtoken");
const user = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers["authorization"];
    
    if (!token) {
        return res.redirect('/login');
        //return res.status(403).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await user.findById(decoded.id); // Store the user ID in the request object
        res.locals.user = req.user;
        next();
    } catch (err) {
        res.status(403).send("Session Expired: Please re-login into your account");
    }
};

module.exports = authMiddleware;