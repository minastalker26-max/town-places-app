const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const os = require("os");
const User = require("../models/User");
const Place = require("../models/Place");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// يبني ملف txt فيه كل المستخدمين والأماكن الحالية، ويرسله على إيميلك
async function sendDatabaseSnapshot(reason = "تحديث في قاعدة البيانات") {
  try {
    const users = await User.find().select("-password").lean();
    const places = await Place.find().lean();

    const timestamp = new Date().toLocaleString("ar-IQ", {
      timeZone: "Asia/Baghdad",
    });

    let content = `تقرير قاعدة البيانات - ${timestamp}\n`;
    content += `السبب: ${reason}\n`;
    content += `==================================================\n\n`;

    content += `--- المستخدمون (${users.length}) ---\n`;
    users.forEach((u, i) => {
      content += `${i + 1}. ${u.displayName || u.username || "بدون اسم"} | `;
      content += `username: ${u.username || "-"} | phone: ${u.phone || "-"} | `;
      content += `email: ${u.email || "-"} | provider: ${u.provider} | `;
      content += `تاريخ التسجيل: ${new Date(u.createdAt).toLocaleString("ar-IQ")}\n`;
    });

    content += `\n--- الأماكن (${places.length}) ---\n`;
    places.forEach((p, i) => {
      const avg =
        p.ratings && p.ratings.length
          ? (
              p.ratings.reduce((a, r) => a + r.stars, 0) / p.ratings.length
            ).toFixed(1)
          : "لا يوجد تقييم";
      content += `${i + 1}. ${p.name} | التصنيف: ${p.category || "-"} | `;
      content += `التقييم: ${avg} (${p.ratings?.length || 0} تقييم) | `;
      content += `العنوان: ${p.address || "-"}\n`;
      content += `   الوصف: ${p.description || "-"}\n`;
    });

    const tmpPath = path.join(os.tmpdir(), `db-snapshot-${Date.now()}.txt`);
    fs.writeFileSync(tmpPath, content, "utf8");

    await transporter.sendMail({
      from: `"موقع أماكن المدينة" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `تحديث قاعدة البيانات - ${reason}`,
      text: "نسخة محدّثة من قاعدة البيانات مرفقة كملف txt.",
      attachments: [{ filename: "database-snapshot.txt", path: tmpPath }],
    });

    fs.unlinkSync(tmpPath);
    console.log("📧 تم إرسال نسخة قاعدة البيانات إلى", process.env.GMAIL_USER);
  } catch (err) {
    console.error("❌ فشل إرسال الإيميل:", err.message);
  }
}

module.exports = { sendDatabaseSnapshot };
