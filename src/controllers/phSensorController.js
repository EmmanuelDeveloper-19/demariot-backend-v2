const ph = require('../models/phSensor');

exports.create = async(req, res) => {
    try {
        const {
            id_sensor, 
            timestamp,
            values,
            location
        } = req.body;

        const newData = new ph({
            id_sensor,
            timestamp,
            values,
            location:{
                type: location.type,
                coordinates: location.coordinates
            }
        });

        const save = await newData.save();
        res.status(201).json({message: "Datos del sensor de ph agregados correctamente. ", phSensor: save});
    } catch(error) {
        res.status(500).json({message: "Error al enviar los datos", error});
    }
};

exports.get = async(req, res) => {
    try {
        const phSensor = await ph.find();
        res.status(200).json({ message: "Datos del sensor obtenidos correctamente. ", phSensor});
    } catch(error){
        res.status(500).json({message: "Error al obtener los datos del sensor. ", error});
    }
}