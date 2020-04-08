
exports.up = function(knex) {
    return knex.schema.createTable("cargos", tbl => {
        tbl.increments();
        tbl.string('type');
        tbl.string('description');
        tbl.integer('volume');
        tbl.timestamps();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('cargos')
};
