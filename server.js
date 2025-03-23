const express = require("express");
const app = require("./app");
const { PrismaClient }  = require("@prisma/client");
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;
const prisma = new PrismaClient();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
