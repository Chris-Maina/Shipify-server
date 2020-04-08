
exports.up = function(knex) {
  return knex.schema.renameTable('cargos', 'cargo')
};

exports.down = function(knex) {
  return knex.schema.renameTable('cargo', 'cargos')
};
