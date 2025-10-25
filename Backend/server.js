require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
   origin: 'http://localhost:5173', // frontend URL
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Example route
app.get('/', (req, res) => {
   res.send('MediTrack API is running');
});

const PORT = process.env.PORT || 5000;

// Routes setup
app.use('/api/auth', require('./Routes/AuthRoute'));
app.use('/api/users', require('./Routes/UserRoute'));
app.use('/api/medical', require('./Routes/MedicalHistoryRoute'));
app.use('/api/doctor', require('./Routes/DoctorFdbackRoute'));
app.use('/api/healthlogs', require('./Routes/HealthLogRoute'));
app.use('/api/healthgoals', require('./Routes/HealthGoalRoute'));
app.use('/api/appointments', require('./Routes/AppointmentRoute'));
app.use('/api/payments', require('./Routes/PaymentRoute'));
app.use('/api/prescriptions', require('./Routes/PrescriptionRoute'));
app.use('/api/insurances', require('./Routes/InsuranceRoute'));
app.use('/api/notifications', require('./Routes/NotificationRoute'));
app.use('/api/loginattempts', require('./Routes/LoginAttemptRoute'));
app.use('/api/auditlogs', require('./Routes/AuditLogRoute'));
app.use('/api/access', require('./Routes/AccessRoute'));
app.use('/api/assignments', require('./Routes/AssignmentRoute'));

// Start the server
app.listen(PORT, () => {
   console.log(`Server started on port ${PORT}`);
   console.log('Connected Successfully ✅');
});