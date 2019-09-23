exports.up = function(knex) {
  return knex.schema.createTable("providers", tbl => {
    tbl.increments();
    tbl.string("name", 255).unique().notNullable;
    tbl.datetime("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("providers");
};
