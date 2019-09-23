const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/secrets");
const {
  getUserByUsername,
  addUser,
  AddProvider
} = require("../../data/helpers");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) throw new Error(400); // Request is missing either or both username and password.
    const [user] = await getUserByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.password))
      throw new Error();
    const token = jwt.sign({ id: user.id }, jstSecret, { expiresIn: "1d" });
    const isProvider = Boolean(user.providerID); // If provider exists, it will convert to true
    res.json({ token, isProvider });
  } catch (error) {
    if (error.message === "400") {
      return res.status(400).json({
        error: "Request must include values for username and password."
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, providerName } = req.body;
    if (!username || !password) throw new Error(400);
    const credentials = { username, password };
    const hash = bcrypt.hashSync(credentials.password, 10);
    credentials.password = hash;
    let providerID = null;
    if (providerName) [providerID] = await AddProvider(providerName);
    credentials.providerID = providerID;
    const [id] = await addUser(credentials);
    if (!id) throw new Error();
    const token = jwt.sign({ id }, jwtSecret, { expiresIn: "1d" });
    const isProvider = Boolean(credentials.providerID); // If providerId exists, it will convert to true
    return res.status(201).json({ token, isProvider });
  } catch (error) {
    if (/unique constraint/i.test(error.message)) {
      return res
        .status(400)
        .json({ error: "Username already associated with an account." });
    } else if (error.message === "400") {
      return res.status(400).json({
        error: "Request must include values for username and password."
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
