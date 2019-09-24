const db = require("../dbConfig");

module.exports = {
  getImmunization,
  getImmunizations
};

function getImmunization(id) {
  return db("immunizations").where({ id });
}

function getImmunizations() {
  return db("immunizations");
}
