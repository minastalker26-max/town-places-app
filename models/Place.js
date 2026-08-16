const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stars: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, maxlength: 300 },
  },
  { timestamps: true }
);

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true, default: "عام" },
    address: { type: String, trim: true },
    image: { type: String, trim: true }, // رابط صورة (اختياري)
    ratings: [ratingSchema],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

placeSchema.virtual("averageRating").get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.stars, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

placeSchema.set("toJSON", { virtuals: true });
placeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Place", placeSchema);
