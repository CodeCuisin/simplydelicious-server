const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//get all users
router.get("/users", async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();

    if (!allUsers || allUsers.length === 0) {
      return res.status(200).json({ message: "No users found" });
    }

    res.json(allUsers);
  } catch (err) {
    console.error("Error getting users from DB:", err);
    res.status(500).json({ message: "Error getting users from DB" });
  }
});

//get user by specific ID
router.get("/users/:usersId", async (req, res) => {
  const { usersId } = req.params;
  const id = parseInt(usersId, 10); // Convert to an integer

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error getting user from DB:", err);
    res.status(500).json({ message: "Error getting user from DB" });
  }
});

module.exports = router;
