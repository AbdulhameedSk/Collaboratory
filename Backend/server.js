const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("../Backend/db/connect");
const app = express();
dotenv.config();
connectDB();
//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
const userRoutes = require("./routes/userRoutes.js");
const projectRoutes = require("./routes/projectRoutes");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/projects", projectRoutes);

const PORT = process.env.PORT || 1996;
const mode = process.env.DEV_MODE;
app.listen(PORT, () => {
  console.log(`Listening at ${mode} ` + PORT.bgRed);
});