const jwt = require("jsonwebtoken");
const userModel = require("../Models/UserModel");

const AdminMiddleware = async (req, res, next) => {
  try {
    // Get token from the same cookie used during login
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET);

    // Find user
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Found"
      });
    }

    // Check admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Store logged-in user
    req.user = user;

    next();

  } catch (err) {
    next(err);
  }
};

module.exports = AdminMiddleware;