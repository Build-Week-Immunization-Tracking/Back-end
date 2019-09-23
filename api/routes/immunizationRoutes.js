const { getImmunizations } = require("../../data/helpers");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const immunization = await getImmunizations();
    res.json({ immunization });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
