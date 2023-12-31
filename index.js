const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const Ratelimit = require("express-rate-limit");
const cors = require("cors");
const { readdirSync } = require("fs");

const PlayersRegister = require("./controllers/PlayersRegister");
const PlayersOnline = require("./controllers/PlayersOnline");
dotenv.config();

const connectDB = require("./Config/db");
const { time } = require("console");
const app = express();

const limiter = Ratelimit({
  windowMs: 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "คำขอมากเกินไป",
  keyGenerator: (req, res) => {
    return req.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
  },
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(limiter);

connectDB();
PlayersRegister();
PlayersOnline();

readdirSync("./routes").map((r) => app.use(require("./routes/" + r)));
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
