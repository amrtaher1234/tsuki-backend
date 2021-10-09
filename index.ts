import express from "express";
import cors from "cors";
import connect from "./connection";
import baseRouter from "./routes";
const app: express.Application = express();
require("dotenv").config();
connect();
app.use(express.json());
app.use(cors({ origin: true }));
app.listen(process.env.PORT || 3000);
app.use("/", baseRouter);
