exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("providers")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("providers").insert([{ name: "Dr. Gregory House" }]);
    });
};
