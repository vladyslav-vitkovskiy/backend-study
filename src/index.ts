require("dotenv").config();
import express, { Application, NextFunction, Request, Response } from "express";
import dataSource from "./db/dataSource";
import { User } from "./db/entities/User";
import { Posts } from "./db/entities/Posts";
import { postsSeed } from "./db/seeds/posts.seed";
import { Tokens } from "./db/entities/Tokens";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app: Application = express();
const port = 3000;

app.use(express.json());

const seedDatabase = async () => {
  const posts = await dataSource.getRepository(Posts).find();

  if (posts.length) {
    console.log("Database already seeded");
    return;
  }

  posts.push(
    await dataSource.getRepository(Posts).save(postsSeed[0]),
    await dataSource.getRepository(Posts).save(postsSeed[1]),
    await dataSource.getRepository(Posts).save(postsSeed[2])
  );
};
//@ts-ignore
const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authorization = req.headers["authorization"];

  const token = authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ msg: "User is not valid" });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: Error, user: any) => {
      if (err) {
        res.status(401).json({ msg: "Token is not valid" });
        return;
      }

      req.user = user;

      next();
    }
  );
};

dataSource
  .initialize()
  .then(() => {
    console.log("Database initialized");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    seedDatabase();
  })
  .catch((err) => {
    console.error(err);
  });

app.get("/posts", authMiddleware, async (_, res) => {
  const posts = await dataSource.getRepository(Posts).find();

  res.json(posts);
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
    }).save();

    res.status(200).json({ name: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ msg: "Invalid username or password" });
    }

    const isPasswordCorrect = bcrypt.compare(user.password, password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Invalid username or password" });
    }

    const accessToken = jwt.sign(
      { name: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "60s",
      }
    );
    const refreshToken = jwt.sign(
      { name: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    dataSource.getRepository(Tokens).save({
      token: refreshToken,
      user,
    });

    return res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);

    return res.status(401).json({ msg: "User is not valid" });
  }
});

app.post("/token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ msg: "User is not valid" });
    return;
  }

  const token = await dataSource
    .getRepository(Tokens)
    .findOne({ where: { token: refreshToken } });

  if (!token) {
    res.status(401).json({ msg: "User is not valid" });
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: Error, user: any) => {
      if (err) {
        res.status(401).json({ msg: "User is not valid" });
        return;
      }

      const accessToken = jwt.sign(
        { name: user.name },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "60s",
        }
      );

      res.status(201).json({ accessToken });
    }
  );
});

app.delete("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: "User is already logged out" });
  }

  dataSource.getRepository(Tokens).delete({ token: refreshToken });

  return res.status(204).json({ msg: "User logged out" });
});
