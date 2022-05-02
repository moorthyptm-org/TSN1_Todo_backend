//importing external dependency
const express = require("express");
const bodyParser = require("body-parser");

const userRouter = require("./user");
const authRouter = require("./auth");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => res.json({ message: "Hello TSN1" }));

app.use("/user", userRouter);
app.use("/login", authRouter);

app.listen(PORT, () => {
  console.log("\x1b[36m", `Server running on http://localhost:${PORT}`);
});
