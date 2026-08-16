const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const User = require("../models/User");
const { ensureAuthenticated } = require("../middleware/auth");
const { sendDatabaseSnapshot } = require("../utils/emailNotifier");

// ---------- الصفحة الرئيسية: عرض كل الأماكن ----------
router.get("/", async (req, res) => {
  const places = await Place.find().sort({ createdAt: -1 }).lean({ virtuals: true });
  let currentUser = null;
  if (req.session.userId) currentUser = await User.findById(req.session.userId).lean();

  res.render("index", { places, currentUser, isAdmin: !!req.session.isAdmin });
});

// ---------- صفحة مكان واحد بالتفصيل ----------
router.get("/place/:id", async (req, res) => {
  const place = await Place.findById(req.params.id)
    .populate("ratings.user", "displayName username")
    .lean({ virtuals: true });
  if (!place) return res.redirect("/");

  let currentUser = null;
  if (req.session.userId) currentUser = await User.findById(req.session.userId).lean();

  res.render("place", { place, currentUser, isAdmin: !!req.session.isAdmin });
});

// ---------- إضافة تقييم (يتطلب تسجيل دخول كضيف) ----------
router.post("/place/:id/rate", ensureAuthenticated, async (req, res) => {
  const { stars, comment } = req.body;
  const place = await Place.findById(req.params.id);
  if (!place) return res.redirect("/");

  // امنع نفس المستخدم من التقييم مرتين، حدّث تقييمه بدل هيك
  const existingIndex = place.ratings.findIndex(
    (r) => r.user.toString() === req.session.userId.toString()
  );

  if (existingIndex >= 0) {
    place.ratings[existingIndex].stars = Number(stars);
    place.ratings[existingIndex].comment = comment;
  } else {
    place.ratings.push({ user: req.session.userId, stars: Number(stars), comment });
  }

  await place.save();
 sendDatabaseSnapshot(`تقييم جديد على مكان: ${place.name}`);

  res.redirect(`/place/${place._id}`);
});

module.exports = router;
