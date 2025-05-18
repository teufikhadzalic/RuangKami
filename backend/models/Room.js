const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  building: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['classroom', 'conference', 'laboratory', 'auditorium', 'study'],
    required: true
  },
  facilities: {
    hasProjector: {
      type: Boolean,
      default: false
    },
    hasWhiteboard: {
      type: Boolean,
      default: false
    },
    hasComputers: {
      type: Boolean,
      default: false
    },
    numberOfComputers: {
      type: Number,
      default: 0
    },
    hasAirConditioner: {
      type: Boolean,
      default: false
    },
    numberOfAC: {
      type: Number,
      default: 0
    },
    acPowerConsumption: {
      type: Number,
      default: 0
    },
    numberOfLights: {
      type: Number,
      default: 0
    },
    lightPowerConsumption: {
      type: Number,
      default: 0
    },
    hasAudioSystem: {
      type: Boolean,
      default: false
    },
    audioSystemPowerConsumption: {
      type: Number,
      default: 0
    }
  },
  baseRatePerHour: {
    type: Number,
    required: true
  },
  electricityRatePerKWh: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Room', RoomSchema);