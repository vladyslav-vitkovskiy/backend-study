import express from "express";
import { User } from "./db/entities/User";
import dataSource from "./db/dataSource";
import { Tokens } from "./db/entities/Tokens";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(express.json());

dataSource
  .initialize()
  .then(() => {
    console.log("Database initialized");

    app.listen(4000, () => {
      console.log("Listening on port 4000");
    });
  })
  .catch((err) => {
    console.error(err);
  });

app.post("/register", async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      userName: username,
      password: hashedPassword,
      firstName,
      lastName,
    }).save();
    res.status(201).json({ name: newUser.userName });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save user to database" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { userName: username } });

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const accessToken = jwt.sign(
    { name: user.userName },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  const refreshToken = jwt.sign(
    { name: user.userName },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  await Tokens.create({
    user: user,
    refreshToken,
  }).save();

  return res.json({ accessToken, refreshToken });
});

app.post("/token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.sendStatus(401).json({ error: "Refresh token not found" });
  }

  const token = await Tokens.findOne({ where: { refreshToken } });

  if (!token) {
    return res.sendStatus(403).json({ error: "Refresh token not found" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: Error, user: any) => {
      if (err) {
        return res.sendStatus(403).json({ error: "Invalid refresh token" });
      }

      const accessToken = jwt.sign(
        { name: user.name },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );

      return res.json({ accessToken });
    }
  );

  return res.sendStatus(500).json({ error: "Internal server error" });
});
