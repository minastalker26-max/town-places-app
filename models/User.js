const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true },
    password: { type: String }, // مشفّرة (bcrypt) - تُستخدم لتسجيل الدخول بيوزر/باسورد أو رقم هاتف
    phone: { type: String, trim: true, unique: true, sparse: true },
    email: { type: String, trim: true, unique: true, sparse: true },

    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },

    displayName: { type: String, trim: true },
    provider: {
      type: String,
      enum: ["local", "phone", "google", "facebook", "admin"],
      default: "local",
    },

    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
