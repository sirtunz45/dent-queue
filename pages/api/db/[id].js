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

export default async function handler(req, res) {
  const { id } = req.query; // ดึง id จาก URL

  if (!id) {
    return res.status(400).json({ error: 'ID is required.' });
  }

  let connection;

  try {
    connection = await createDBConnection();

    if (req.method === 'GET') {
      // ดึงข้อมูลของ ID ที่ระบุ
      const query = `SELECT * FROM service WHERE id = ?`;
      const [rows] = await connection.execute(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Record not found.' });
      }

      return res.status(200).json(rows[0]);

    } else if (req.method === 'PUT') {
      const {
        FName, 
        LName, 
        phone_no, 
        dent_cc,
        treatment_right, 
        date_service, 
        time_service,
        time_state, 
        status,
        pregnant, 
        last_period 
      } = req.body;
    
      if (!FName && !LName && !phone_no && !dent_cc &&
          !treatment_right && !date_service && !time_service &&
          !status && !pregnant && !last_period) { 
        return res.status(400).json({ error: 'At least one field is required for update.' });
      }
    
      const updates = {};
      if (FName) updates.FName = FName;
      if (LName) updates.LName = LName;
      if (phone_no) updates.phone_no = phone_no;
      if (dent_cc) updates.dent_cc = dent_cc;
      if (treatment_right) updates.treatment_right = treatment_right;
      if (date_service) updates.date_service = date_service;
      if (time_service) updates.time_service = time_service;
      if (time_state) updates.time_state = time_state;
      if (status) updates.status = status;
      if (pregnant) updates.pregnant = pregnant;
      if (last_period) {
        const formattedLastPeriod = new Date(last_period).toISOString().split("T")[0];
        updates.last_period = formattedLastPeriod;
      }
    
      const query = `
        UPDATE service
        SET ${Object.keys(updates).map((key) => `${key} = ?`).join(', ')}
        WHERE id = ?
      `;
      const values = [...Object.values(updates), id];
    
      const [result] = await connection.execute(query, values);
    
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Record not found.' });
      }
    
      return res.status(200).json({ message: 'Record updated successfully!' });
    
    } else if (req.method === 'DELETE') {
      // ลบข้อมูลตาม ID
      const query = `DELETE FROM service WHERE id = ?`;
      const [result] = await connection.execute(query, [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Record not found.' });
      }

      return res.status(200).json({ message: 'Record deleted successfully!' });

    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Database Error:', error.message);
    return res.status(500).json({ error: 'Database operation failed.' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
