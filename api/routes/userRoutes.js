const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const {
  getUser,
  updateUser,
  deleteUser,
  deleteProvider
} = require("../../data/helpers");

router.get("/", async (req, res) => {
  try {
    const id = req.decoded.id;
    const result = await getUser(id);
    const { password, ...user } = result;
    if (!user.providerId) delete user.providerId;
    return res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const id = req.decoded.id;
    const { username, password, email } = req.body;
    const keysToUpdate = {
      username,
      password: password ? bcrypt.hashSync(password, 10) : undefined,
      email
    };
    for (let key in keysToUpdate)
      if (!keysToUpdate[key]) delete keysToUpdate[key];
    if (!Object.keys(keysToUpdate).length) throw new Error(400);
    const numberOfUpdated = await updateUser(id, keysToUpdate);
    if (!numberOfUpdated) throw new Error(404);
    const success = await getUser(id);
    delete success.password;
    if (!success.providerId) delete success.providerId;
    res.status(200).json({ success });
  } catch (error) {
    switch (error.message) {
      case "400":
        return res
          .status(400)
          .json({ error: "Please provide key to update on user." });
      case "404":
        return res
          .status(404)
          .json({
            error:
              "No user with that ID found.  Please reauthenticate and try again."
          });
      default:
        res.status(500).json({ error: error.message });
    }
  }
});

router.delete("/", async (req, res) => {
  try {
    const id = req.decoded.id;
    const user = await getUser(id);
    let usersDeleted; // If the user is a provider, deleting the entry in the providers table will cause a cascade that will delete the user account
    if (user.providerId) usersDeleted = await deleteProvider(user.providerId);
    else usersDeleted = await deleteUser(id);
    if (!usersDeleted) throw new Error(404);
    res.json({ usersDeleted });
  } catch (error) {
    switch (error.message) {
      case "404":
        return res
          .status(404)
          .json({
            error:
              "No user by that ID found.  Please reauthenticate and try again."
          });
      default:
        res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
