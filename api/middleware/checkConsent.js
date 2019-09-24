const {
  getUser,
  getPatient,
  getPermittedProviders
} = require("../../data/helpers");

async function checkConsent(req, res, next) {
  try {
    const userId = req.decoded.id;
    const patientId = req.params.id;
    const user = await getUser(userId);
    const [patient] = await getPatient(patientId);
    const permittedProviders = await getPermittedProviders(patientId);
    if (!patient) throw new Error(404);
    if (
      patient.userId === userId ||
      permittedProviders.map(provider => provider.id).includes(user.providerId)
    ) {
      req.patient = patient;
      if (user.providerId) req.providerId = user.providerId;
      next();
    } else throw new Error(403);
  } catch (error) {
    switch (error.message) {
      case "404":
        return res.status(404).json({ error: "No patient by that ID found." });
      case "403":
        return res.status(403).json({ error: "Unauthorized" });
      default:
        return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = checkConsent;
