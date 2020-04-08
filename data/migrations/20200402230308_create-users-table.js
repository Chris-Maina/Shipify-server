
exports.up = function(knex) {
    return knex.schema.createTable("users", tbl => {
        tbl.increments();
        tbl.string('first_name');
        tbl.string('last_name');
        tbl.string('email');
        tbl.string('hash');
        tbl.string('salt');
        tbl.timestamps();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
