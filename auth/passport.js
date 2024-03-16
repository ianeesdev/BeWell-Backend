const passport = require("passport");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("./models/userModel");
const { config } = require("./config/settings");

passport.serializeUser((user, done) => {
  // loads into req.session.passport.user
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // loads into req.user
  done(null, user);
});

// passport.js strategy for Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        var user = await User.findOne({ googleId: profile.id });
        const id = user._id;

        if (!user) {
          user = new User({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        const token = jwt.sign({ id }, config.jwtSecret, {
          expiresIn: "30d",
        });
        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
