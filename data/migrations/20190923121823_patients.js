exports.up = function(knex) {
  return knex.schema.createTable("patients", tbl => {
    tbl.increments();
    // First name, last name REQUIRED
    tbl.string("firstName", 255).notNullable();
    tbl.string("lastName", 255).notNullable();
    // birthday, REQUIRED
    tbl.date("birthDate").notNullable();
    // Set user ID to users table to allow providers to access data
    tbl
      .integer("userId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    tbl.datetime("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("patients");
};
