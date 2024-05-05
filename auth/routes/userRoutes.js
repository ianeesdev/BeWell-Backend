const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUser,
  saveOnboardingResponses,
  addTestResult,
  getTestsHistroy
} = require("../controllers/userController");
require("../passport");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/resetPassword", resetPassword);
router.get("/getUser", protect, getUser);
router.post("/onboardingResponses", protect, saveOnboardingResponses)
router.post("/addTestResult", protect, addTestResult)
router.get("/getTestsHistroy", protect, getTestsHistroy);

// For Google account login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/auth/login",  
  }), (req, res) => {
    const {user, token} = req.user;
    const userInfo = {
      _id: user._id,
      email: user.email,
      isLoggedIn: true,
      onboarded: user.onboarded,
      token: token,
    };

    res.redirect(
      `http://localhost:3000/auth/redirect?user=${userInfo.token}`,
    )
  }
);

module.exports = router;
