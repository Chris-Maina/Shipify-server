const knexConfig = require('../../data/db');
const { Model } = require('objection');

Model.knex(knexConfig);

class Shipment extends Model {
    static get tableName() {
        return 'shipments';
    }

    static get relatedInsertQueryMutates() {
        return true;
    }

    static get relationMappings() {
        const User = require('./user');
        const Cargo = require('./cargo');
        return {
            cargo: {
                relation: Model.ManyToManyRelation,
                modelClass: Cargo,
                join: {
                    from: 'shipments.id',
                    through: {
                        from: 'shipment_cargo.shipment_id',
                        to: 'shipment_cargo.cargo_id',
                        extra: ['volume']
                    },
                    to: 'cargo.id'
                }
            },
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'shipments.user_id',
                    to: 'users.id'
                }
            }
        }
    }
}

module.exports = Shipment;
