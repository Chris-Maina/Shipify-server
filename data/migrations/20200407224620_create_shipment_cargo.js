
exports.up = function (knex) {
    return knex.schema.table('cargos', tbl => {
        tbl.dropColumn('volume')
    })
        .createTable('shipment_cargo', tbl => {
            tbl.integer('volume');
            tbl.integer('cargo_id');
            tbl.integer('shipment_id');
        })
};

exports.down = function (knex) {
    return knex.schema.table('cargos', tbl => {
        tbl.integer('volume')
    })
        .dropTable('shipment_cargo');
};
