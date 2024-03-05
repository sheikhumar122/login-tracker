// import { connection } from "./utils/db.js";
// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import { createTables } from "./Models/createTable.js";
// import { userRouter } from "./Routes/userRoutes.js";
// import path  from 'path';
// const port = process.env.PORT || 3009;

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// app.use("/api/v1",userRouter);

// app.get("/test", (req, res, next) => {
//   res.status(200).json({
//     success: true,
//     message: "API is Working",
//   });
// });

// // Set EJS as the view engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Routes
// app.get('/login', (req, res) => {
//     res.render('login');
// });

// app.get('/signup', (req, res) => {
//     res.render('signup');
// });

// app.get('/dashboard', (req, res) => {
//     res.render('dashboard');
// });
// app.listen(port, () => {
//   console.log(`listening on port: ${port}`);
// });

// connection.connect((err) => {
//   if (err) throw err;
//   console.log("connected to DB");
//   createTables();
// });

import { connection } from "./utils/db.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createTables } from "./Models/createTable.js";
import { userRouter } from "./Routes/userRoutes.js";
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3009;

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/v1", userRouter);

app.get("/test", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "API is Working",
  });
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('register');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected to DB");
  createTables();
});
