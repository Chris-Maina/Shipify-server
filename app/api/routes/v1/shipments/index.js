const express = require('express');
const router = express.Router();

const auth = require('../../../middlewares/auth');
const Cargo = require('../../../../models/cargo');
const Shipment = require('../../../../models/shipment');

router.get('/shipments', auth.required, async (req, res) => {
    const { user } = req;
    try {
        const shipments = await Shipment.query().where('user_id', user.id).withGraphFetched('cargos');
        return res.status(200).json({
            data: shipments
        });
    } catch (error) {
        return res.status(422).json({
            errors: {
                message: error.message
            }
        })
    }
});

router.post('/shipments', auth.required, async (req, res) => {
    const {
        user,
        body: { name, mode, type, origin, destination, total, status, cargo }
    } = req;
    try {
        let shipment = await Shipment.query().findOne({ name });
        if (shipment) return res.status(409).json({
            errors: {
                message: `A shipment with name ${name} exists. Use different name`
            }
        });

        shipment = await Shipment.query().insert({
            name,
            mode,
            type,
            origin,
            destination,
            total,
            status,
            user_id: user.id
        });

        // Add cargo supplied
        await Promise.all(
            cargo.map(async el => {
                const { type, description, volume } = el;
                return await Cargo.query().insert({
                    type,
                    description,
                    volume,
                    shipment_id: shipment.id
                });
            })
        );

        // find shipment after adding cargo
        shipment = await Shipment.query().findById(shipment.id).withGraphFetched('cargos');

        return res.status(200).json({
            data: shipment
        })
    } catch (error) {
        return res.status(422).json({
            errors: {
                message: error.message
            }
        })
    }
})

module.exports = router;