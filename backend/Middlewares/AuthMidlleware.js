const jwt = require("jsonwebtoken");
const userModel = require("../Models/UserModel");

const AuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login"
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        if (
            err.name === "JsonWebTokenError" ||
            err.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired session"
            });
        }

        next(err);
    }
};

module.exports = AuthMiddleware;