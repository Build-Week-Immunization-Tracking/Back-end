exports.up = function(knex, Promise) {
  return knex.schema.createTable("patients", tbl => {
    if (knex.client.config.client === "pg") {
      tbl
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"));
    } else {
      tbl.increments();
    }
    tbl.string("firstName", 255).notNullable();
    tbl.string("lastName", 255).notNullable();
    tbl.date("birthDate").notNullable();
    if (knex.client.config.client === "pg") {
      tbl
        .uuid("userId")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    } else {
      tbl
        .integer("userId")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    }
    tbl.datetime("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("patients");
};
