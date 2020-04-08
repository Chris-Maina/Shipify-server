const { Model } = require('objection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const knexConfig = require('../../data/db');

Model.knex(knexConfig);

class User extends Model {
    static get tableName() {
        return 'users';
    }

    setPassword(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
    }

    validatePassword(password) {
        const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
        return this.hash === hash;
    }

    generateJWTToken() {
        const today = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(today.getDate() + 60);

        return jwt.sign({
            email: this.email,
            id: this.id,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, process.env.JWT_SECRET);
    }

    toAuthJSON() {
        return {
            id: this.id,
            email: this.email,
            token: this.generateJWTToken(),
        };
    }

    static get relationMappings() {
        const Shipment = require('./shipment');
        return {
            shipments: {
                relation: Model.HasManyRelation,
                modelClass: Shipment,
                join: {
                    from: 'users.id',
                    to: 'shipments.user_id'
                }
            }
        }
    }
}

module.exports = User;
