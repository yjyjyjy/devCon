const express = require("express");
const connectDB = require("./config/db");
const path = require("path"); // core node.js module to manipulate path

const app = express();

// connect to Mongo DB
connectDB();

// a new way to do bodyParser
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// serve static asset in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build")); // set static folder to "client/build"

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  }); // for any other route except the routes specified above, /client/build/index.html will be served.
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
