require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("./config/passport");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, // 30 يوم
  })
);

app.use(passport.initialize());
app.use(passport.session());

// اجعل حالة تسجيل الدخول متاحة داخل كل الـ views
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.session.userId;
  res.locals.isAdmin = !!req.session.isAdmin;
  next();
});

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/places"));
app.use("/admin", require("./routes/admin"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running: http://localhost:${PORT}`));
