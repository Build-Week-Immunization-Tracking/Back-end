exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("patients")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("patients").insert([
        {
          firstName: "Rebecca",
          lastName: "Adler",
          birthDate: "5/10/75",
          userID: 1
        }
      ]);
    });
};
