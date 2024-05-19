import express from "express";
import { config } from "dotenv";
import home from "./routes/home.js";
import gettrain from "./routes/getTrains.js";
import { stations } from "./constants/data.js";
import algo1 from "./algos/algo1.js"

config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use("/", home);
app.use("/trains", gettrain);
app.use("/algo1",algo1);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
