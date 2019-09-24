const db = require("../dbConfig");

module.exports = {
  getPermissions,
  giveConsentToProvider,
  removeConsentFromProvider
};

async function getPermissions(patientId) {
  // For development purposes only
  return db("permissions");
}

async function giveConsentToProvider(patientId, providerId) {
  try {
    const [patient] = await db("patients").where({ id: patientId });
    const [provider] = await db("providers").where({ id: providerId });
    if (!patient || !provider) {
      const errorMessage = `No ${
        patient ? "provider" : "patient"
      } found with that ID.`;
      throw new Error(errorMessage);
    }
    const [success] = await db("permissions")
      .returning(["patientId", "providerId", "createdAt"])
      .insert({ patientId, providerId });
    return Promise.resolve(success);
  } catch (error) {
    if (/unique constraint/i.test(error.message))
      error.message = "Provider already has consent.";
    return Promise.reject(error);
  }
}

async function removeConsentFromProvider(patientId, providerId) {
  try {
    const [patient] = await db("patients").where({ id: patientId });
    const [provider] = await db("providers").where({ id: providerId });
    if (!patient || !provider) {
      const errorMessage = `No ${
        patient ? "provider" : "patient"
      } found with that ID.`;
      throw new Error(errorMessage);
    }
    const criteria = { patientId, providerId };
    const success = await db("permissions")
      .where(criteria)
      .del();
    return Promise.resolve(success);
  } catch (error) {
    return Promise.reject(error);
  }
}
