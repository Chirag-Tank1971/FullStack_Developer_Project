const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const adminMiddleware = (req, res, next) => {
  if (req.headers.authorization !== "Bearer admin-token") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

const loggerMiddleware = (req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
};

app.use(loggerMiddleware);

app.post("/login", (req, res) => {
  res.json({ message: "This is response from Login Route" });
});

app.post("/signup", (req, res) => {
  res.json({ message: "This is response from Signup Route" });
});

app.post("/signout", (req, res) => {
  res.json({ message: "This is response from Signout Route" });
});

app.get("/user", (req, res) => {
  res.json({ message: "This is response from User Route" });
});

app.get("/admin", (req, res) => {
  res.json({ message: "This is response from Admin Route" });
});

app.get("/home", (req, res) => {
  res.json({ message: "This is response from Home Page" });
});

app.get("/about", (req, res) => {
  res.json({ message: "This is response from About Page" });
});

app.get("/news", (req, res) => {
  res.json({ message: "This is response from News Page" });
});

app.get("/blogs", (req, res) => {
  res.json({ message: "This is response from Blogs Page" });
});

app.use((req, res) => res.status(404).json({ message: "Not Found" }));
app.listen(4000, () => console.log("Server running on port 4000"));
