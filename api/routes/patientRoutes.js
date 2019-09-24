const express = require("express");
const router = express.Router();
const {
  getUser,
  getPatient,
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
  getPatientsForProvider,
  getPermittedProviders,
  giveConsentToProvider,
  removeConsentFromProvider,
  getImmunizationRecords,
  recordImmunization
} = require("../../data/helpers");

// GET Patients, /patients/
router.get("/", async (req, res) => {
  try {
    const userId = req.decoded.id;
    const user = await getUser(userId);
    let patients;
    if (user.providerId) {
      patients = await getPatientsForProvider(user.providerId);
    } else {
      patients = await getPatients(userId);
    }
    res.json({ patients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST New Patient, /patients/
router.post("/", async (req, res) => {
  try {
    const userId = req.decoded.id;
    const { firstName, lastName, birthDate } = req.body;
    if (!firstName || !lastName || !birthDate) throw new Error(400);
    const user = await getUser(userId);
    if (!user) throw new Error(404);
    if (user.providerId) throw new error(403);
    const newPatient = {
      firstName,
      lastName,
      birthDate,
      userId
    };
    const [id] = await addPatient(newPatient);
    const [success] = await getPatient(id);
    res.status(201).json({ success });
  } catch (error) {
    switch (error.message) {
      case "400":
        return res.status(400).json({
          error:
            "Request must include values for firstName, lastName, and birthDate."
        });
      case "404":
        return res.status(404).json({ error: "No user found with that ID." });
      case "403":
        return res.status(403).json({
          error:
            "Patients cannot be directly associated with a provider account."
        });
      default:
        res.status(500).json({ error: error.message });
    }
  }
});

/* For all endpoints starting with /patients/:id, errors related to lack of authorization or nonexistent 
  patient are handled in checkConsent middleware.  Patient object is also passed as req.patient. */

// GET Patient, /patients/:id
router.get("/:id", async (req, res) => {
  try {
    const patient = req.patient;
    res.json({ patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Patient, /patients/:id
router.put("/:id", async (req, res) => {
  try {
    const patient = req.patient;
    const { firstName, lastName, birthDate } = req.body;
    const keysToUpdate = { firstName, lastName, birthDate };
    for (let key in keysToUpdate) {
      if (!keysToUpdate[key]) delete keysToUpdate[key];
      if (!Object.keys(keysToUpdate).length) throw new Error(400);
      const success = await updatePatient(patient.id, keysToUpdate);
      res.json({ success });
    }
  } catch (error) {
    switch (error.message) {
      case "400":
        return res
          .status(400)
          .json({ error: "Please include values for keys to update." });
      default:
        res.status(500).json({ error: error.message });
    }
  }
});

// DELETE Patient, /patients/:id
router.delete("/:id", async (req, res) => {
  try {
    const patient = req.patient;
    const numberDeleted = await deletePatient(patient.id);
    if (!numberDeleted) throw new Error(404);
    res.json({ numberDeleted });
  } catch (error) {
    switch (error.message) {
      case "404":
        return res.status(404).json({ error: "No ptient with that ID found." });
      default:
        res.status(500).json({ error: error.message });
    }
  }
});

// GET, POST, and DELETE Consent, /patients/:id/consent
router.get("/:id/consent", async (req, res) => {
  try {
    const id = req.decoded.id;
    const patient = req.patient;
    if (id !== patient.userId) throw new Error(403);
    const providers = await getPermittedProviders(patient.id);
    res.json({ providers });
  } catch (error) {
    switch (error.message) {
      case "403":
        return res.status(403).json({ error: "Unauthorized" });
      default:
        res.status(500).json({ error: error.message });
    }
  }
});
router.post("/:id/consent", async (req, res) => {
  try {
    const id = req.decoded.id;
    const patient = req.patient;
    const { providerId } = req.body;
    if (id !== patient.userId) throw new Error(403);
    const success = await giveConsentToProvider(patient.id, providerId);
    res.status(201).json({ success });
  } catch (error) {
    switch (error.message) {
      case "Provider alread has consent.":
        return res.status(400).json({ error: "Provider already has consent" });
      case "403":
        return res.status(403).json({ error: "Unauthorized" });
      default:
        res.status(500).json({ error: error.message });
    }
  }
});
router.delete("/:id/consent", async (req, res) => {
  try {
    const id = req.decoded.id;
    const patient = req.patient;
    const { providerId } = req.body;
    if (id !== patient.userId) throw new Error(403);
    const numberDeleted = await removeConsentFromProvider(
      patient.id,
      providerId
    );
    if (!numberDeleted) throw new Error(400);
    const providers = await getPermittedProviders(patient.id);
    res.status(200).json({ providers });
  } catch (error) {
    if (error.message.includes("found with that ID.")) {
      return res.status(404).json({ error: error.message });
    }
    switch (error.message) {
      case "400":
        return res
          .status(400)
          .json({ error: "Provider does not currently have consent" });
      case "403":
        return res.status(403).json({ error: "Unauthorized" });
      default:
        res.status(500).json({ error: error.message });
    }
  }
});

// GET and POST Immunizations, /patients/:id/immunizations
router.get("/:id/immunizations", async (req, res) => {
  try {
    const { id } = req.params;
    const history = await getImmunizationRecords(id);
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/:id/immunizations", async (req, res) => {
  try {
    const patientId = req.params.id;
    const providerId = req.providerId;
    if (!providerId) throw new Error(403);
    const { immunizationId, appointmentDate } = req.body;
    const [success] = await recordImmunization({
      patientId,
      immunizationId,
      appointmentDate,
      providerId
    });
    res.status(201).json({ success });
  } catch (error) {
    if (/foreign key constraint/i.test(error.message)) {
      const type = error.message.match(/(?<=_)[a-zA-Z]+(?=_foreign"$)/)[0];
      return res
        .status(404)
        .json({ error: "No entry found in database with matchin ${type}." });
    } else if (/unique constraint/i.test(error.message)) {
      return res
        .status(400)
        .json({ error: "This record has alread been added." });
    } else if (error.message === "403") {
      return res
        .status(403)
        .json({ error: "Immunziation records must be added." });
    } else if (/null constraint/i.test(error.message)) {
      return res.status(400).json({
        error:
          "Request must include valid values for both immuniztionId and appointmentDate."
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
