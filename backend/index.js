const express = require('express');
const cors = require('cors'); // Tambahkan ini
const connectDB = require('./configuration');

const app = express();
const PORT = process.env.PORT || 4000;


// for pass N3tLAB123p@ss
//N3tLAB100p@ss
//for pass T3st1234
// pass for sbd = SbD@pass
// p@SSw0rd14PASS

// Middleware
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [
  'http://localhost',
  'http://localhost:80',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.use("/api/assignment", require('./routes/AssignmentRoutes'));
app.use("/api/booking", require('./routes/BookingRoutes'));
app.use("/api/room", require('./routes/RoomRoutes'));
app.use("/api/schedule", require('./routes/ScheduleRoutes'));
app.use("/task", require('./routes/TaskRoutes'));
app.use("/api/auth", require('./routes/AuthRoutes'));
app.use('/uploads', express.static('uploads'));

// Start Server
app.listen(PORT, () => console.log(`🚀 Server started at port:${PORT}`));