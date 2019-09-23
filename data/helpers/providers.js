const db = require("../dbConfig");

module.exports = {
  getProviders,
  getProviderbyId,
  addProvider,
  updateProvider,
  deleteProvider
};

function getProviders() {
  return db("providers");
}

function getProviderbyId(id) {
  return db("providers").where({ id });
}

function addProvider(name) {
  return "providers".returning("id").insert({ name });
}

function updateProvider(id, update) {
  return db("providers")
    .where({ id })
    .returning(["id", "name", "createdAt"])
    .update(update);
}

function deleteProvider(id) {
  return db("providers")
    .where({ id })
    .del();
}
