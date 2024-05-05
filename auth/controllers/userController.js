const asyncHandler = require("express-async-handler");
const userService = require("../services/userService");

// @desc    Register new user
// @route   POST /auth/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await userService.registerUser(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Authenticate a user
// @route   POST /auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.loginUser(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Send password reset link to user's email
// @route   POST /auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userService.forgotPassword(email);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Reset user password
// @route   POST /auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { id, token, password } = req.body;
  console.log(id, token, password);

  try {
    const result = await userService.resetPassword(id, token, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Reset user password
// @route   POST /auth/reset-password
// @access  Public
const getUser = asyncHandler(async (req, res) => {
  const id = req.user.id;

  try {
    const user = await userService.getUser(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// @desc    Save Onboarding Question
// @route   POST /auth/onboardingResponses
// @access  Private
const saveOnboardingResponses = asyncHandler(async (req, res) => {
  const { userId, onboardingResponses } = req.body;

  try {
    const response = await userService.saveOnboardingResponses(userId, onboardingResponses);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Save user test information
// @route   POST /auth/addTestResult
// @access  Private
const addTestResult = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { testName, score, prediction, date, userResponses  } = req.body;

  try {
    const response = await userService.addTestResult(userId, testName, score, prediction, date, userResponses);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Get test history
// @route   POST /auth/getTestsHistroy
// @access  Private
const getTestsHistroy = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const response = await userService.getTestsHistroy(userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  forgotPassword,
  getUser,
  saveOnboardingResponses,
  addTestResult,
  getTestsHistroy
};
