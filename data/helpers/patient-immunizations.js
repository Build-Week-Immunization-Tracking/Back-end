const db = require("../dbConfig");

module.exports = {
  recordImmunization
};

function recordImmunization(info) {
  return db("patient_immunizations")
    .returning(["patientId", "immuizationId", "providerId"])
    .insert(info);
}
