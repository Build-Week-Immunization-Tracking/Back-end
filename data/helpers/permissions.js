const db = require("../dbConfig");

module.exports = {
  getPermissions
};

function getPermissions(patientId) {
  return db("permissions");
}
