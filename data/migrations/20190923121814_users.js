exports.up = function(knex) {
  return knex.schema.createTable("users", tbl => {
    //Username 255 chars max, REQUIRED, Must be unique
    tbl
      .string("username", 255)
      .notNullable()
      .unique();
    // password 255 chars max, REQUIRED, must be unique
    tbl
      .string("password", 255)
      .notNullable()
      .unique();
    // email 255 chars max, REQUIRED, must be unique
    tbl
      .string("email", 255)
      .notNullable()
      .unique();
    // add a provider id based on providers
    tbl
      .integer("providerId")
      .unsigned()
      .defaultTo(null)
      .references("id")
      .inTable("providers")
      .onDelete("CASCADE");
    // created AT will default to time created
    tbl.datetime("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
