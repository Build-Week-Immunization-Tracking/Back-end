const db = require("../dbConfig");

module.exports = {
  recordImmunization,
  getImmunizationRecords
};

function getImmunizationRecords(id) {
  return db("patients")
    .where({ "patients.id": id })
    .join("patient_immunizations as PI", { "patients.id": "PI.patientId" })
    .join("immunizations", { "immunizations.id": "PI.immunizationId" })
    .select(
      "immunizations.id as immunization_id",
      "immunizations.name as immunization_name",
      "PI.providerId as provider_id", // Could also join providers table to supply provider name
      "PI.appointmentDate as appointment_date"
    );
}

function recordImmunization(info) {
  return db("patient_immunizations")
    .returning(["patientId", "immunizationId", "appointmentDate", "providerId"])
    .insert(info);
}
