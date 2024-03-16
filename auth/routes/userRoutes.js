const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  addMember,
  getUser
} = require("../controllers/userController");
require("../passport");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/resetPassword", resetPassword);
router.put("/addMember/:id", protect, addMember);
router.get("/getUser", protect, getUser)

// For Google account login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",  
  }), (req, res) => {
    const {user, token} = req.user;
    const userInfo = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      isLoggedIn: true,
      isMember: user.isMember,
      token: token,
    };

    res.redirect(
      `http://localhost:3000/oauth/redirect?user=${userInfo.token}`,
    )
  }
);

module.exports = router;
