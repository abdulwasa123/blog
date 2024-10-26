const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers["authorization"];
    
    if (!token) {
        return res.redirect('/login');
        //return res.status(403).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id; // Store the user ID in the request object
        res.locals.user = req.user;
        next();
    } catch (err) {
        res.status(403).send("Invalid token.");
    }
};

module.exports = authMiddleware;