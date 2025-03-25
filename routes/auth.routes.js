const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const saltRounds = 10;

// Signup Route
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Provide email, password, and name" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Provide a valid email address." });
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
    });

    const { id, name: userName, email: userEmail } = newUser;
    res.status(201).json({ user: { id, name: userName, email: userEmail } });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error" }); // Return a generic error message
    next(error);
  }
});

// Login Route
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Provide email and password." });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const payload = { id: user.id, email: user.email, name: user.name };
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h", // Token expiry time
    });

    res.status(200).json({ authToken });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" }); // Return a generic error message
    next(error);
  }
});

// Verify Route (Protected)
router.get("/verify", isAuthenticated, (req, res) => {
  console.log("User Verified:", req.payload);
  res.status(200).json(req.payload); // Return user payload
});

module.exports = router;
