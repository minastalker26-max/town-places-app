const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const { ensureAdmin } = require("../middleware/auth");
const { sendDatabaseSnapshot } = require("../utils/emailNotifier");

// ---------- لوحة تحكم الأدمن ----------
router.get("/panel", ensureAdmin, async (req, res) => {
  const places = await Place.find().sort({ createdAt: -1 }).lean({ virtuals: true });
  res.render("admin-panel", { places, editPlace: null });
});

// ---------- إضافة مكان جديد ----------
router.post("/places", ensureAdmin, async (req, res) => {
  const { name, description, category, address, image } = req.body;
  await Place.create({ name, description, category, address, image });
 sendDatabaseSnapshot(`الأدمن أضاف مكان جديد: ${name}`);
  res.redirect("/admin/panel");
});

// ---------- فتح فورم تعديل مكان ----------
router.get("/places/:id/edit", ensureAdmin, async (req, res) => {
  const places = await Place.find().sort({ createdAt: -1 }).lean({ virtuals: true });
  const editPlace = await Place.findById(req.params.id).lean();
  res.render("admin-panel", { places, editPlace });
});

// ---------- تحديث مكان (تغيير الاسم / الوصف / ...) ----------
router.post("/places/:id/update", ensureAdmin, async (req, res) => {
  const { name, description, category, address, image } = req.body;
  const place = await Place.findByIdAndUpdate(req.params.id, {
    name,
    description,
    category,
    address,
    image,
  });
 sendDatabaseSnapshot(`الأدمن عدّل مكان: ${name}`);
  res.redirect("/admin/panel");
});

// ---------- حذف مكان ----------
router.post("/places/:id/delete", ensureAdmin, async (req, res) => {
  const place = await Place.findByIdAndDelete(req.params.id);
 sendDatabaseSnapshot(`الأدمن حذف مكان: ${place?.name || ""}`);
  res.redirect("/admin/panel");
});

module.exports = router;
