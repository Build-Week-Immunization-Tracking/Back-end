const jwtSecret = process.env.JWT_SECRET || "Keep it safe, keep it secret";

const port = process.env.PORT || 5007;

const seedPW = process.env.SEED_PW || "password";

module.exports = {
  jwtSecret,
  port,
  seedPW
};
