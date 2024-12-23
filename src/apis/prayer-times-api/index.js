const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const PrayerTime = require("../../model/PrayerTime");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "MONGO_URI=mongodb://mongo:27017/realtime-api";

// Middleware untuk parsing JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Error connecting to MongoDB:", err));

// Route untuk mendapatkan waktu salat
app.get("/prayer-times", async (req, res) => {
  try {
    const { city = "Surabaya", country = "ID", method = 1 } = req.query;

    // Panggil API eksternal
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`
    );

    const prayerTimes = response.data.data.timings;

    // Simpan data ke MongoDB
    const newPrayerTime = new PrayerTime(prayerTimes);
    await newPrayerTime.save();

    res.status(200).json({
      success: true,
      message: "Prayer times fetched and saved successfully",
      data: prayerTimes,
    });
  } catch (error) {
    console.error("❌ Error fetching prayer times:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch prayer times",
      error: error.message,
    });
  }
});

// Route fallback untuk 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
