import mysql from 'mysql2/promise';

async function createDBConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
  });
}

function getCurrentDateTime() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { queueId, status } = req.body;

  if (!queueId || !status) {
    return res.status(400).json({ error: 'Queue ID and status are required.' });
  }

  let connection;

  try {
    connection = await createDBConnection();

    // ✅ ดึงข้อมูลคิวจาก `service`
    const [rows] = await connection.execute(`SELECT * FROM service WHERE id = ?`, [queueId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Queue not found.' });
    }

    const queueData = rows[0];
    queueData.status = status;
    queueData.date_time = getCurrentDateTime();

    console.log("📌 Saving to history:", queueData);

    // ✅ เพิ่มข้อมูลลงใน `history`
    const query = `
      INSERT INTO history (FName, LName, phone_no, dent_cc, treatment_right, date_service, time_state, time_service, date_time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      queueData.FName,
      queueData.LName,
      queueData.phone_no,
      queueData.dent_cc,
      queueData.treatment_right,
      queueData.date_service,
      queueData.time_state,
      queueData.time_service,
      queueData.date_time,
      queueData.status,
    ];

    await connection.execute(query, values);

    return res.status(200).json({ message: '✅ History recorded successfully!' });
  } catch (error) {
    console.error('❌ Database Error:', error);
    res.status(500).json({ error: 'Failed to record history.', details: error.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
