import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import financialRecordRouter from "./routes/financial-record";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

const username = process.env.DB_USERNAME!;
const rawPassword = process.env.DB_PASSWORD!;
const password = encodeURIComponent(rawPassword);

const mongoURI = `mongodb+srv://${username}:${password}@financetracker.yfe8jwa.mongodb.net/finance_tracker?authSource=admin`;

app.use(express.json());
app.use(cors());

mongoose
  .connect(mongoURI)
  .then(() => console.log("CONNECTED TO MONGODB"))
  .catch((err) => {
    console.error("Fail to connect to MongoDB");
    console.error(err.message);
    process.exit(1);
  });

app.use("/financial-records", financialRecordRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
