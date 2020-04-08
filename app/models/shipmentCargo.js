const knexConfig = require('../../data/db');
const { Model } = require('objection');

Model.knex(knexConfig);

class ShipmentCargo extends Model {
    static get tableName() {
        return 'shipment_cargo'
    }

    static get idColumn() {
        return ['cargo_id', 'shipment_id']
    }

    static get relationMappings() {
        const Cargo = require('./cargo');
        const Shipment = require('./shipment');
        return {
            cargos: {
                relation: Model.HasManyRelation,
                modelClass: Cargo,
                join: {
                    from: 'shipment_cargo.cargo_id',
                    to: 'cargos.id'
                }
            },
            shipments: {
                relation: Model.HasManyRelation,
                modelClass: Shipment,
                join: {
                    from: 'shipment_cargo.shipment_id',
                    to: 'shipments.id'
                }
            }
        }
    }
}

module.exports = ShipmentCargo;
