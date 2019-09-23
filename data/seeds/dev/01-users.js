exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "James Wilson",
          password: "cancerdoctor",
          email: "cancerdoctor@housemd.com",
          providerId: 1
        },
        {
          username: "Alison Cameron",
          password: "immunology",
          email: "immunology@housemd.com",
          providerId: 1
        }
      ]);
    });
};
