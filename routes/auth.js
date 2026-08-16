const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendDatabaseSnapshot } = require("../utils/emailNotifier");

// ---------- صفحات ----------
router.get("/signup", (req, res) => res.render("signup", { error: null }));
router.get("/login", (req, res) => res.render("login", { error: null }));

// ---------- تسجيل حساب ضيف جديد (يوزر/باسورد أو رقم هاتف/باسورد) ----------
router.post("/signup", async (req, res) => {
  try {
    const { username, phone, password } = req.body;

    if (!password || (!username && !phone)) {
      return res.render("signup", {
        error: "لازم تدخل يوزرنيم أو رقم هاتف مع كلمة سر",
      });
    }

    const existing = await User.findOne({
      $or: [{ username }, { phone }],
    });
    if (existing) {
      return res.render("signup", { error: "هذا الحساب موجود مسبقاً" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username || undefined,
      phone: phone || undefined,
      password: hashed,
      displayName: username || phone,
      provider: phone ? "phone" : "local",
    });

    req.session.userId = user._id;
   sendDatabaseSnapshot(`تسجيل مستخدم جديد: ${user.displayName}`);

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("signup", { error: "صار خطأ، جرب مرة ثانية" });
  }
});

// ---------- تسجيل دخول ضيف (يوزر أو رقم هاتف + باسورد) ----------
router.post("/login", (req, res, next) => {
  passport.authenticate("guest-local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.render("login", { error: info?.message || "بيانات غير صحيحة" });

    req.session.userId = user._id;
    res.redirect("/");
  })(req, res, next);
});

// ---------- Google ----------
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.userId = req.user._id;
   sendDatabaseSnapshot(`تسجيل دخول عبر Google: ${req.user.displayName}`);
    res.redirect("/");
  }
);

// ---------- Facebook ----------
router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.userId = req.user._id;
   sendDatabaseSnapshot(`تسجيل دخول عبر Facebook: ${req.user.displayName}`);
    res.redirect("/");
  }
);

// ---------- تسجيل خروج ----------
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// ---------- دخول الأدمن (المالك فقط) ----------
router.get("/admin/login", (req, res) => res.render("admin-login", { error: null }));

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true;
    return res.redirect("/admin/panel");
  }
  res.render("admin-login", { error: "بيانات الدخول غير صحيحة" });
});

router.get("/admin/logout", (req, res) => {
  req.session.isAdmin = false;
  res.redirect("/");
});

module.exports = router;
