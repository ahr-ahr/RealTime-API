const mongoose = require("mongoose");

// Skema waktu salat
const prayerTimeSchema = new mongoose.Schema(
  {
    Fajr: { type: String, required: true },
    Sunrise: { type: String, required: true },
    Dhuhr: { type: String, required: true },
    Asr: { type: String, required: true },
    Maghrib: { type: String, required: true },
    Isha: { type: String, required: true },
  },
  { timestamps: true } // Menambahkan waktu createdAt dan updatedAt
);

module.exports = mongoose.model("PrayerTime", prayerTimeSchema);
