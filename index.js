import dotenv from "dotenv";
import "express-async-errors";
import connectDB from "./db/connect.js";
import express from "express";
import cors from "cors";

import notesRouter from "./routes/notesRoutes.js";
import userRouter from "./routes/userRoutes.js";
import bodyParser from "body-parser";


import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import authenticateUser from "./middlewares/authentication.js";
import helmet from "helmet";

import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import {dirname} from 'path'
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();
const app = express();


//only when ready to deploy
//app.use(express.static(path.resolve(__dirname, './client/build')));

const __dirname= dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.resolve(__dirname,'./client/dist')))
//app.use(express.static(path.resolve(__dirname,'./public')))
//middleware

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());

app.use(mongoSanitize());

//routes
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/v1/notes", authenticateUser, notesRouter);
app.use("/api/v1/auth", userRouter);



// only when ready to deploy
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});



app.use(notFound);
app.use(errorHandler);

const port = 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
