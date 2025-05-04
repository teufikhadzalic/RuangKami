// filepath: src/lib/mongoClient.ts
import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb+srv://muhmhilmi:Muhammadhilmi21@tutam.kjnyx7w.mongodb.net/'; // Ganti dengan URI MongoDB Anda
const client = new MongoClient(mongoUrl);

export async function connectToDatabase() {
  try {
    if (!client.db('admin')) { // Check if the client is connected by accessing the 'admin' database
      await client.connect();
      console.log('Connected to MongoDB'); // Tambahkan log ini
    }
    return client.db('tutam'); // Ganti dengan nama database Anda
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}