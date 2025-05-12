const prototype = require("../models/prototype");

exports.create = async(req, res) => {
    try{
        const {
            id_prototype,
            created_at,
            status,
            battery,
            location,
            network
        } = req.body;

        const newData = new prototype({
            id_prototype,
            created_at,
            status,
            battery,
            location: {
                type: location.type,
                coordinates: location.coordinates
            },
            network:{
                signal_strength: network.signal_strength,
                last_connection: network.last_connection
            }
        });

        const save = await newData.save();
        res.status(201).json({message: "Datos guardados correctamente", prototype:save});
    }catch(error){
        res.status(500).json({message: "Error al enviar los datos", error});
    }

}

exports.get = async(req, res) => {
    try{
        const prototype = await prototype.find();
        res.status(200).json({message: "Datos del prototipo obtenidos correctamente", prototyp});
    } catch(error){
        res.status(500).json({message: "Error al obtener los datos del prototipo.", error})
    }
}