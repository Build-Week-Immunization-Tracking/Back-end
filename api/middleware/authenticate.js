const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/secrets");
const { getUser } = require("../../data/helpers");

async function authenticate(req, res, next) {
  try {
    const header = req.get("Authorization") || authError();
    const token = header.split(" ")[0] || authError();
    const decoded = jwt.verify(token, jwtSecret); // Will throw error if unsuccessful
    const user = await getUser(decoded.id);
    if (!user) authError(); // Cannot continue with above syntax, as await getUser() will always return a promise
    req.decoded = decoded;
    return next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

function authError() {
  throw new Error("Token must be set on Authorization header.");
}

module.exports = authenticate;
