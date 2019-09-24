const db = require("../dbConfig");

module.exports = {
  getProviders,
  getProvider,
  addProvider,
  updateProvider,
  deleteProvider
};

function getProviders() {
  return db("providers");
}

function getProvider(id) {
  return db("providers").where({ id });
}

function addProvider(name) {
  return db("providers")
    .returning("id")
    .insert({ name });
}

function updateProvider(id, changes) {
  return db("providers")
    .where({ id })
    .returning(["id", "name", "createdAt"])
    .update(changes);
}

function deleteProvider(id) {
  return db("providers")
    .where({ id })
    .del();
}
