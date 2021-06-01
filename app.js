const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: true,
  credentials: true
};
app.options("*", cors(corsOptions));

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const { config } = require("./config/setup");

// CORS stuff
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.listen(config.port, () => {
  console.log(`Server listening on port - ${config.port}`);
});

const webpieceRoutes = require("./api/routes/webpieceRoutes");
const updateRequestRoutes = require("./api/routes/updateRequestsRoutes");

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Webpiece api" });
});

app.use("/webpieces", webpieceRoutes);
app.use("/updates", updateRequestRoutes);
