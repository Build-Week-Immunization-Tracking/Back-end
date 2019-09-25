const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/secrets");
const {
  getUserByUsername,
  addUser,
  addProvider
} = require("../../data/helpers");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) throw new Error(400);
    const [user] = await getUserByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.password))
      throw new Error();
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1d" });
    const isProvider = Boolean(user.providerId); // if providerId exists, it will convert to true
    res.json({ id: user.id, token, isProvider });
  } catch (error) {
    if (error.message === "400")
      return res.status(400).json({
        error: "Request must include values for username and password."
      });
    else res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, email, providerName } = req.body;
    if (!username || !password || !email) throw new Error(400);
    const credentials = { username, password, email };
    const hash = bcrypt.hashSync(credentials.password, 10);
    credentials.password = hash;
    let providerId = null;
    if (providerName) [providerId] = await addProvider(providerName);
    credentials.providerId = providerId;
    const [id] = await addUser(credentials);
    if (!id) throw new Error();
    const token = jwt.sign({ id }, jwtSecret, { expiresIn: "1d" });
    const isProvider = Boolean(credentials.providerId); // if providerId exists, it will convert to true
    return res.status(201).json({ token, isProvider });
  } catch (error) {
    if (/unique constraint/i.test(error.message))
      return res.status(400).json({
        error: "Username and/or email already associated with an account."
      });
    else if (error.message === "400")
      return res.status(400).json({
        error:
          "Request must include values for username, password, and email keys."
      });
    else res.status(500).json({ error: error.message });
  }
});

module.exports = router;
