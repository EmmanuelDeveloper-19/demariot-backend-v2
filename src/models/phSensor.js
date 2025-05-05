const mongoose = require("mongoose");

const location = new mongoose.Schema({
    type: {type: String, enum:['Point'], required: true},
    coordinates: {type:[Number], required: true}
});

const phSchema = new mongoose.Schema({
    id_sensor: {type: String, required: true},
    timestamp: {type: Date, default: Date.now},
    values: {type: Number, required: true},
    location: {type: location, required:true}
});

const ph = mongoose.model("phSensor", phSchema);
module.exports = ph;


/*
Dependiendo de la configuración podemos útilizar el siguiente esquema.
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Esquema para mediciones de pH
const PhMeasurementSchema = new Schema({
  device_id: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now, // Fecha actual del servidor si no se proporciona
    index: true
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  temperature: {
    type: Number,
    required: false
  },
  calibration_status: {
    slope: {
      type: Number,
      default: 100 // Valor ideal de calibración (%)
    },
    offset: {
      type: Number,
      default: 0
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number], // [longitud, latitud]
      required: true
    }
  },
  metadata: {
    water_body: {
      type: String,
      default: 'Desconocido'
    },
    operator: {
      type: String,
      default: 'sistema'
    }
  }
});

// Índice geoespacial para búsquedas por ubicación
PhMeasurementSchema.index({ location: '2dsphere' });

// ----------------------------------------------------

// Esquema para mediciones de turbidez
const TurbidityMeasurementSchema = new Schema({
  device_id: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    unit: 'NTU' // Nephelometric Turbidity Units
  },
  voltage_reading: {
    type: Number,
    required: false
  },
  temperature: {
    type: Number,
    required: false
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['stable', 'drifting', 'maintenance'],
    default: 'stable'
  }
});

TurbidityMeasurementSchema.index({ location: '2dsphere' });

// ----------------------------------------------------

// Modelos finales
const PhMeasurement = mongoose.model('PhMeasurement', PhMeasurementSchema);
const TurbidityMeasurement = mongoose.model('TurbidityMeasurement', TurbidityMeasurementSchema);

module.exports = {
  PhMeasurement,
  TurbidityMeasurement
};*/