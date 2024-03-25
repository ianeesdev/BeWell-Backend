// const asyncHandler = require("express-async-handler");
// const userService = require("../services/userService");

// // @desc    Register new user
// // @route   POST /auth/signup
// // @access  Public
// const registerUser = asyncHandler(async (req, res) => {
//   const { username, name, email, password } = req.body;

//   try {
//     const user = await userService.registerUser(username, name, email, password);
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = {
//   registerUser
// };
