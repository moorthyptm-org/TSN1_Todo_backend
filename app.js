//importing external dependency
const express = require("express");
const bodyParser = require("body-parser");

const userRoute = require("./user");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => res.json({ message: "Hello TSN1" }));

app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log("\x1b[36m", `Server running on http://localhost:${PORT}`);
});
