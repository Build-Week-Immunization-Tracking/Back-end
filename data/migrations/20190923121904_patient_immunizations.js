exports.up = function(knex) {
  return knex.schema.createTable("patient_immunizations", tbl => {
    // get patient ID then get immunization id and providerID
    tbl
      .integer("patientId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("patients")
      .onDelete("CASCADE");
    tbl
      .integer("immunizationId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("immunizations")
      .onDelete("CASCADE");
    tbl.date("appointmentDate").notNullable();
    tbl
      .integer("providerId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("providers")
      .onDelete("SET NULL");
    tbl.datetime("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("patient_immunizations");
};
