
exports.up = function(knex) {
  return knex.schema.createTable('shipments', tbl => {
    tbl.increments();
    tbl.string('name');
    tbl.string('mode');
    tbl.string('type');
    tbl.string('destination');
    tbl.string('origin');
    tbl.integer('total');
    tbl.enu('status', ['ACTIVE', 'COMPLETED', 'INACTIVE']);
    tbl.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('shipments');
};
