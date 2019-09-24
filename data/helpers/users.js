const db = require("../dbConfig");
const { getPatientsForProvider } = require("./patients");

module.exports = {
  addUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserByUsername,
  getPatientsByUser
};

function addUser(user) {
  return db("users")
    .returning("id")
    .insert(user);
}

async function getUser(id) {
  try {
    const [user] = await db("users").where({ id });
    if (!user) throw new Error("No user found by that ID.");
    const patients = user.providerId
      ? await getPatientsForProvider(user.providerId)
      : await getPatientsByUser(id);
    return Promise.resolve({ ...user, patients });
  } catch (error) {
    return Promise.reject(error);
  }
}

function getUsers() {
  return db("users");
}

function updateUser(id, update) {
  return db("users")
    .where({ id })
    .returning(["id", "username", "email", "providerId", "createdAt"])
    .update(update);
}
function deleteUser(id) {
  return db("users")
    .where({ id })
    .del();
}

function getUserByUsername(username) {
  return db("users").where({ username });
}

function getPatientsByUser(id) {
  return db("patients").where({ "patients.userId": id });
}
