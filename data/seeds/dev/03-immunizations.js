exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("immunizations")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("immunizations").insert([
        { name: "Hepatitis B Vaccine - (HepB)" }
      ]);
    });
};
