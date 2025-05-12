const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const routes = require("./routes/routes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use("/api", routes);
app.use(errorMiddleware);

module.exports = app;