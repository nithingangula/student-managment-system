const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Token required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
};


// Role authorization
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        next();
    };
};


module.exports = {
    authMiddleware,
    authorizeRole
};