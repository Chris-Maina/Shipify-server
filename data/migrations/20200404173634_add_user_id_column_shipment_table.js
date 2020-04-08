
exports.up = function (knex) {
    return knex.schema.table('shipments', tbl => {
        tbl.integer('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.table('shipments', tbl => {
        tbl.dropColumn('user_id')
    });
};
