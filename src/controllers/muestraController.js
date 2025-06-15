const muestra = require('../models/muestra');

exports.create = async (req, res) => {
    try {
        const {
            timestamp,
            color,
            observation,
            location
        } = req.body;

        const newData = new muestra({
            timestamp,
            color: {
                rgb: color.rgb,
                hsv: color.hsv,
                hex: color.hex,
                intensityLevel: color.intensityLevel
            },
            observation,
            location: {
                type: location.type,
                coordinates: location.coordinates
            },
        });

        const save = await newData.save();
        res.status(201).json({
            message: "Datos del sensor de la muestra agregados correctamente",
            data: save
        });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar la muestra" });

    }
}

exports.get = async(req, res) => {
    try {
        const muestra = await muestra.find();
        res.status(200).json({message: "Datos de la muestra obtenidos correctamente", muestra});
    } catch(error){
        res.status(500).json({message: "Error al obtener los datos", error});
    }
}