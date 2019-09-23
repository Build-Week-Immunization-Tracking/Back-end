exports.up = function(knex) {
  return knex.schema.createTable("immunizations", tbl => {
    tbl.increments();
    tbl
      .string("name", 255)
      .notNullable()
      .unique();
    tbl.datetime("createAt").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("immunizations");
};
