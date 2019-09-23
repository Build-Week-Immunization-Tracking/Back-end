const db = require("../dbConfig");
const { getPatientsForProvider } = require("./patients");

module.exports = {
  addUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  getUserByUsername,
  getPatientsbyUsersId
};

function addUser(user) {
  return db("users")
    .returning("id")
    .insert(user);
}

function getUserById(id) {}

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

function getPatientsbyUsersId(id) {
  return db("patients").where({ "patients.userId": id });
}
