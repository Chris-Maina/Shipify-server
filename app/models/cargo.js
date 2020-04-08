const knexConfig = require('../../data/db');
const { Model } = require('objection');

Model.knex(knexConfig);

class Cargo extends Model {
    static get tableName() {
        return 'cargos';
    }
    static get relationMappings() {
        const Shipment = require('./shipment');
        return {
            shipments: {
                relation: Model.ManyToManyRelation,
                modelClass: Shipment,
                join: {
                    from: 'cargos.id',
                    through: {
                        from: 'shipment_cargo.cargo_id',
                        to: 'shipment_cargo.shipment_id'
                    },
                    to: 'shipments.id'
                }
            }
        }
    }
}

module.exports = Cargo;
