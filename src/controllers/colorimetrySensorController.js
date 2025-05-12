const colorimetry = require('../models/colorimetrySensor');

exports.create = async(req, res) => {
    try {
        const {
            id_sensor,
            timestamp,
            location,
            metals,
        } = req.body;

        const newData = new colorimetry({
            id_sensor,
            timestamp,
            location: {
                type: location.type,
                coordinates: location.coordinates
            },
            metals: {
                metal: metals.metal,
                concentration_mgL: metals.concentration_mgL,
                colorRGB: metals.colorRGB
            }
        });

        const save = await newData.save();
        res.status(201).json({message: "Datos del sensor de colorimetria agregados correctamente", colorimetrySensor: save});
    } catch(error){
        res.status(500).json({message: "Error al enviar los datos", error})
    }
};

exports.get = async(req, res) => {
    try {
        const colorimetrySensor = await colorimetry.find();
        res.status(200).json({message: "Datos del sensor obtenidos correctamente", colorimetrySensor});
    } catch(error){
        res.status(500).json({message: "Error al obtener los datos", error});
    }
}