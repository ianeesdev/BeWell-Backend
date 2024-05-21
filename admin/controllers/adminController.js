const asyncHandler = require("express-async-handler");
const userService = require("../services/adminService");

// @desc    Authenticate a user
// @route   POST /auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminService.loginAdmin(email, password);
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { loginAdmin };
