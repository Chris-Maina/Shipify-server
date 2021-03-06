const express = require('express');
const router = express.Router();

const auth = require('../../../middlewares/auth');
const Cargo = require('../../../../models/cargo');
const Shipment = require('../../../../models/shipment');

router.get('/shipments', auth.required, async (req, res) => {
    const { user } = req;
    try {
        const shipments = await Shipment.query().where('user_id', user.id).withGraphFetched('cargo');
        return res.status(200).json({ shipments });
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            error,
        })
    }
});

router.post('/shipments', auth.required, async (req, res) => {
    const {
        user,
        body: { name, mode, type, origin, destination, total, status, cargo }
    } = req;
    try {
        let shipment = await Shipment.query().findOne({ name }).where('user_id', user.id);
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
                const cargoInDB = await Cargo.query().findOne({ type: el.type });
                if (cargoInDB) {
                    const newCargo = { ...cargoInDB, ...el };
                    await shipment.$relatedQuery('cargo').for(shipment.id).relate(newCargo)
                    return shipment.$appendRelated('cargo', newCargo);
                }
                return await shipment.$relatedQuery('cargo').insert({ ...el });
            }
            )
        );

        return res.status(201).json({ shipment });
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            error,
        })
    }
});


router.patch('/shipments', auth.required, async (req, res) => {
    const { body: { id } } = req;

    try {
        const shipment = await Shipment.query().patchAndFetchById(id, req.body);
        return res.status(200).json({ shipment });
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            error,
        })
    }
});

module.exports = router;
