const express = require("express");
const router = express.Router();
const {
  getProviders,
  getProvider,
  getUser,
  updateProvider
} = require("../../data/helpers");

router.get("/", async (req, res) => {
  try {
    const providers = await getProviders();
    res.json({ providers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const providerId = req.params.id;
    const [provider] = await getProvider(providerId);
    if (!provider) throw new Error(404);
    res.json({ provider });
  } catch (error) {
    switch (error.message) {
      case "404":
        return res
          .status(404)
          .json({ error: "No provider found with that ID." });
      default:
        res.status(500).json({ error: error.message });
    }
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.decoded.id;
    const providerId = req.params.id;
    const user = await getUser(userId);
    console.log(user.providerId);
    if (user.providerId == providerId) throw new Error(403);
    const { name } = req.body;
    if (!name) throw new Error(400);
    const [success] = await updateProvider(providerId, { name });
    res.json({ success });
  } catch (error) {
    switch (error.message) {
      case "403":
        return res.status(403).json({ error: "Unauthorized" });
      case "400":
        return res.status(400).json({
          error: "Please provide updated information in request body."
        });
      default:
        res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
