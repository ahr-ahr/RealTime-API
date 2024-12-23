const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/apis/prayer-times-api/index"); // Sesuaikan path ke file app Anda
const PrayerTime = require("../src/model/PrayerTime"); // Sesuaikan path ke model PrayerTime

// Sebelum semua tes, koneksikan ke database test
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Setelah semua tes selesai, disconnect dari MongoDB
afterAll(async () => {
  await mongoose.connection.close();
});

// Sebelum setiap tes, bersihkan database
beforeEach(async () => {
  await PrayerTime.deleteMany({});
});

describe("GET /prayer-times", () => {
  it("should return prayer times and save to database", async () => {
    const response = await request(app).get("/prayer-times");

    // Verifikasi status code dan respon
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Fajr");
    expect(response.body).toHaveProperty("Sunrise");
    expect(response.body).toHaveProperty("Dhuhr");
    expect(response.body).toHaveProperty("Asr");
    expect(response.body).toHaveProperty("Maghrib");
    expect(response.body).toHaveProperty("Isha");

    // Verifikasi bahwa data disimpan di MongoDB
    const prayerTime = await PrayerTime.findOne();
    expect(prayerTime).not.toBeNull();
    expect(prayerTime.Fajr).toBeDefined();
  });

  it("should return 500 if there is an error fetching prayer times", async () => {
    // Simulasikan kesalahan dengan memanipulasi URL API atau endpoint
    jest
      .spyOn(request, "get")
      .mockImplementationOnce(() => Promise.reject(new Error("Network Error")));

    const response = await request(app).get("/prayer-times");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "error",
      "Unable to fetch prayer times"
    );
  });
});
