const db = require("../dbConfig");

module.exports = {
  getImmunizations,
  getImmunizationById
};

function getImmunizationById(id) {
  return db("immunizations").where({ id });
}

function getImmunizations() {
  return db("immunizations");
}
