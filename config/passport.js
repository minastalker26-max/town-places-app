const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ---------- تسجيل دخول الضيوف (يوزر + باسورد أو رقم هاتف + باسورد) ----------
passport.use(
  "guest-local",
  new LocalStrategy(
    { usernameField: "identifier", passwordField: "password" },
    async (identifier, password, done) => {
      try {
        const user = await User.findOne({
          $or: [{ username: identifier }, { phone: identifier }],
        });
        if (!user) return done(null, false, { message: "الحساب غير موجود" });
        if (!user.password)
          return done(null, false, { message: "سجّل الدخول عبر Google أو Facebook" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: "كلمة السر غير صحيحة" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ---------- Google OAuth ----------
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails?.[0]?.value,
              provider: "google",
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

// ---------- Facebook OAuth ----------
if (process.env.FACEBOOK_APP_ID) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "emails"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ facebookId: profile.id });
          if (!user) {
            user = await User.create({
              facebookId: profile.id,
              displayName: profile.displayName,
              email: profile.emails?.[0]?.value,
              provider: "facebook",
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
