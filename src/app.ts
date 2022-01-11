import path from "path";

import "dotenv/config";
import express, { Application } from "express";
import morgan from "morgan";
import expressEjsLayouts from "express-ejs-layouts";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import expressSession from "express-session";
import passport from "passport";

import { dataBaseConnection } from "./utils/db";

// DataBase Connection
dataBaseConnection();

/**
 * 'passport' Configiration
 */
import "./utils/auth";

const app: Application = express();

// Logger
process.env.NODE_ENV === "Development" && app.use(morgan("dev"));

// Set '/public' For Static Files
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Layouts for EJS
app.use(expressEjsLayouts);
app.set("layout", "layout");

/**
 * BodyParser
 * Parse application/x-www-form-urlencoded
 * Parse application/json
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sessions
app.use(
  expressSession({
    secret: "dsvhrvbhjvsbhfb",
    cookie: {
      maxAge: 10000,
    },
    resave: false,
    saveUninitialized: false,
  })
);

// PassportJS
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(connectFlash());

// Routes
app.use(require("./routes/home"));
app.use("/users", require("./routes/loginSignup"));
app.use("/admin", require("./routes/dashboard"));
app.use(require("./routes/pageNotFound"));

const { PORT, HOST, NODE_ENV } = process.env;
app.listen(PORT, () =>
  console.log(
    `Server is Running on -> http://${HOST}:${PORT} and ${NODE_ENV} Mode`
  )
);
