const prediction = require('../models/predictionsModels');

exports.create = async (req, res) => {
    try {
        const {
            timestamp,
            location,
            temporada,
            ph,
            turbidez,
            temp,
            tds,
            colorimetria,
            metal
        } = req.body;


        const newData = new prediction({
            timestamp,
            location: {
                type: location.type,
                coordinates: location.coordinates
            },
            temporada,
            ph,
            turbidez,
            temp,
            tds,
            colorimetria,
            metal
        });

        const save = await newData.save();
        res.status(201).json({ message: "Datos de la predicción agregados correctamente", prediction:save });
    } catch (error) {
        res.status(500).json({ message: "Error al enviar los datos", error });

    }
};

exports.createMany = async (req, res) => {
    try {
        const predictionsArray = req.body;

        // Validación básica
        if (!Array.isArray(predictionsArray) || predictionsArray.length === 0) {
            return res.status(400).json({ message: "Se esperaba un arreglo de predicciones." });
        }

        // Procesar cada predicción (si necesitas transformar location, etc.)
        const processedData = predictionsArray.map(pred => ({
            timestamp: pred.timestamp,
            location: {
                type: pred.location.type,
                coordinates: pred.location.coordinates
            },
            temporada: pred.temporada,
            ph: pred.ph,
            turbidez: pred.turbidez,
            temp: pred.temp,
            tds: pred.tds,
            colorimetria: pred.colorimetria,
            metal: pred.metal
        }));

        const insertedDocs = await prediction.insertMany(processedData);
        res.status(201).json({ message: "Predicciones insertadas correctamente", inserted: insertedDocs });
    } catch (error) {
        res.status(500).json({ message: "Error al insertar predicciones", error });
    }
};

exports.get = async(req, res) => {
    try{
        const predictionSensors = await prediction.find();
        res.status(200).json({message: "Datos", predictionSensors});
    }catch(error){
        res.status(500).json({message: "Error al obtener los datos. ", error});
    }
}