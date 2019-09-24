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

// All functions in this file should use parameters based on the `users` table, such as `users.id` and `users.username`
// Any functions making use of data from the `patients` table should go in `patients.js`

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
  // Should never be used outside of development - HIPAA
  return db("users");
}

function updateUser(id, changes) {
  return db("users")
    .where({ id })
    .returning(["id", "username", "email", "providerId", "createdAt"])
    .update(changes);
}

function deleteUser(id) {
  return db("users")
    .where({ id })
    .del();
}

function getUserByUsername(username) {
  // Primarily for testing purposes
  return db("users").where({ username });
}

function getPatientsByUser(id) {
  return db("patients").where({ "patients.userId": id });
}
