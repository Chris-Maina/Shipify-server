
exports.up = function (knex) {
    return knex.schema.table('cargos', tbl => {
        tbl.dropColumn('shipment_id')
    });
};

exports.down = function (knex) {
    return knex.schema.table('cargos', tbl => {
        tbl.integer('shipment_id').references('shipments.id').onDelete('CASCADE').onUpdate('CASCADE');
    });
};
