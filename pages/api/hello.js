// pages/api/users.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    // Use environment variables from .env.local
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    });

    const [rows] = await connection.execute('SELECT * FROM service');
    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection error' });
  }
}