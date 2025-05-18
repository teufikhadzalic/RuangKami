const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  division: {
    type: String,
    enum: ['art', 'sports', 'academics'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  numberOfAttendees: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'confirmed'
  },
  cancellationReason: {
    type: String
  },
  totalCost: {
    type: Number,
    required: true
  },
  costBreakdown: {
    baseRate: {
      type: Number,
      required: true
    },
    electricityCost: {
      type: Number,
      required: true
    },
    details: {
      durationHours: {
        type: Number,
        required: true
      },
      electricityConsumptionKWh: {
        type: Number,
        required: true
      }
    }
  },
  usedFacilities: {
    useAC: {
      type: Boolean,
      default: false
    },
    numberOfACUsed: {
      type: Number,
      default: 0
    },
    useLights: {
      type: Boolean,
      default: true
    },
    numberOfLightsUsed: {
      type: Number,
      default: 0
    },
    useProjector: {
      type: Boolean,
      default: false
    },
    useAudioSystem: {
      type: Boolean,
      default: false
    },
    useComputers: {
      type: Boolean,
      default: false
    },
    numberOfComputersUsed: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);