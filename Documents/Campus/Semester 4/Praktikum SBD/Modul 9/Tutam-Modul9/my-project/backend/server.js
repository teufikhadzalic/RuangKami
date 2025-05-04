const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors'); // Pastikan hanya ada satu deklarasi
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5173;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoUrl = process.env.MONGO_URI;
const client = new MongoClient(mongoUrl);
let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('tutam'); // Ganti dengan nama database Anda
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

// Routes
app.get('/notes', async (req, res) => {
  try {
    const notes = await db.collection('notes').find({}).toArray();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/notes', async (req, res) => {
  try {
    const note = req.body;
    const result = await db.collection('notes').insertOne(note);
    res.json({ id: result.insertedId, ...note });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});