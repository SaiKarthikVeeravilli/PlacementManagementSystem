
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dns = require("dns");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "config", ".env"),
});

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Keep this only if your current MongoDB connection requires it.
// Otherwise, remove it after testing.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 4006;

// Routes
const router = require("./Routes/AuthRoute");
app.use("/api", router);

const router2 = require("./Routes/CompanyRoute");
app.use("/api", router2);

const router3 = require("./Routes/JobRoute");
app.use("/api", router3);

const router4 = require("./Routes/ApplicationRoute");
app.use("/api", router4);

const router5 = require("./Routes/AdminDashBoardRoute");
app.use("/api", router5);

const router6 = require("./Routes/NotificationRoute");
app.use("/api", router6);

const router7 = require("./Routes/AnalyticsRoute");
app.use("/api", router7);

const router8 = require("./Routes/ReportRoute");
app.use("/api", router8);

const router9 = require("./Routes/EventRoute");
app.use("/api", router9);



const localRouter11 = require("./Routes/localResumeRoute");
app.use("/api", localRouter11);

// Error handling must remain after all routes
const errorhandling = require("./Middlewares/ErrorHandling");
app.use(errorhandling);

// Connect to MongoDB, then start the server
mongoose
  .connect(process.env.DB_LINK)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });