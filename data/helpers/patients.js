const db = require("../dbConfig");

module.exports = {
  getPatients,
  getPatient,
  addPatient,
  updatePatient,
  deletePatient,
  getPermittedProviders,
  getPatientsForProvider
};

// All functions in this file should use parameters based on the `patients` table, such as `patients.id` and `patients.birthDate`
// Any functions making use of data from the `users` table should go in `users.js`

function getPatients(userId) {
  return db("patients").where({ userId });
}

function getPatient(id) {
  return db("patients").where({ id });
}

function addPatient(patient) {
  return db("patients")
    .returning("id")
    .insert(patient);
}

function updatePatient(id, changes) {
  return db("patients")
    .where({ id })
    .returning([
      "id",
      "firstName",
      "lastName",
      "birthDate",
      "userId",
      "createdAt"
    ])
    .update(changes);
}

function deletePatient(id) {
  return db("patients")
    .where({ id })
    .del();
}

function getPermittedProviders(id) {
  return db("patients")
    .where({ "patients.id": id })
    .join("permissions", { "patients.id": "permissions.patientId" })
    .join("providers", { "permissions.providerId": "providers.id" })
    .select("providers.id", "providers.name");
}

function getPatientsForProvider(providerId) {
  return db("permissions")
    .where({ providerId })
    .join("patients", { "patients.id": "permissions.patientId" })
    .select(
      "patients.id",
      "patients.firstName",
      "patients.lastName",
      "patients.birthDate",
      "patients.createdAt"
    );
}
