import express from "express";
import dataSource from "./db/dataSource";
import { Message } from "./db/entities/Message";
import { authMiddleware } from "./middlewaers";
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(express.json());

dataSource
  .initialize()
  .then(() => {
    console.log("Database initialized");

    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });

app.post("/sentMessage", authMiddleware, async (req, res) => {
  const { message, senderId, recipientId } = req.body;

  try {
    const newMessage = await Message.create({
      message,
      senderId,
      recipientId,
      createdAt: new Date(),
    }).save();

    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save message to database" });
  }
});
