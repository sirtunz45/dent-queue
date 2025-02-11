import mysql from 'mysql2/promise';

function convertThaiDateToISO(thaiDate) {
  const months = {
    'มกราคม': '01',
    'กุมภาพันธ์': '02',
    'มีนาคม': '03',
    'เมษายน': '04',
    'พฤษภาคม': '05',
    'มิถุนายน': '06',
    'กรกฎาคม': '07',
    'สิงหาคม': '08',
    'กันยายน': '09',
    'ตุลาคม': '10',
    'พฤศจิกายน': '11',
    'ธันวาคม': '12',
  };

  const [day, monthThai, yearThai] = thaiDate.split(' ');
  const year = parseInt(yearThai, 10) - 543;
  const month = months[monthThai];
  const formattedDay = day.padStart(2, '0');

  return `${year}-${month}-${formattedDay}`;
}

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function createDBConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
  });
}

async function getDatesOnly(connection) {
  const query = `
    SELECT DISTINCT DATE_FORMAT(date_service, '%Y-%m-%d') AS date_service 
    FROM service
    ORDER BY date_service ASC
  `;
  const [rows] = await connection.execute(query);
  return rows.map(row => row.date_service);
}

async function insertHistory(connection, historyData) {
  const query = `
    INSERT INTO history (FName, LName, phone_no, dent_cc, treatment_right, date_service, time_state, time_service, date_time, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    historyData.FName,
    historyData.LName,
    historyData.phone_no,
    historyData.dent_cc,
    historyData.treatment_right,
    historyData.date_service,
    historyData.time_state,
    historyData.time_service,
    historyData.date_time,
    historyData.status,
  ];

  await connection.execute(query, values);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { date, datesOnly } = req.query;
    let connection;

    try {
      connection = await createDBConnection();

      if (datesOnly === 'true') {
        const dates = await getDatesOnly(connection);
        return res.status(200).json({ dates });
      } else if (date) {
        let formattedDate;
        try {
          formattedDate = convertThaiDateToISO(date);
          console.log("Formatted date for SQL query:", formattedDate);
        } catch (err) {
          return res.status(400).json({ error: 'Invalid date format.' });
        }

        const query = `
          SELECT time_state 
          FROM service 
          WHERE date_service = ?
        `;
        const [rows] = await connection.execute(query, [formattedDate]);
        const bookedTimes = rows.map(row => row.time_state);
        return res.status(200).json({ bookedTimes });
      } else {
        const query = `
          SELECT id, FName, LName, phone_no, dent_cc, treatment_right, 
                 DATE_FORMAT(date_service, '%Y-%m-%d') AS date_service, time_service 
          FROM service
        `;
        const [rows] = await connection.execute(query);
        return res.status(200).json({ data: rows });
      }
    } catch (error) {
      console.error('Database Error:', error.message);
      res.status(500).json({ error: 'Failed to retrieve data.' });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } else if (req.method === 'POST') {
    const {
      name,
      surname,
      phone,
      dentalService,
      treatmentRight,
      confirmedDate,
      selectedTime,
      time_state,
    } = req.body;

    if (
      !name ||
      !surname ||
      !phone ||
      !dentalService ||
      !treatmentRight ||
      !confirmedDate ||
      !selectedTime ||
      !time_state
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    let formattedDate;
    try {
      formattedDate = convertThaiDateToISO(confirmedDate);
      console.log("Formatted Date for Insert:", formattedDate);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const currentDateTime = getCurrentDateTime();
    let connection;

    try {
      connection = await createDBConnection();

      const checkQuery = `
        SELECT COUNT(*) AS count
        FROM service
        WHERE date_service = ? AND time_state = ?
      `;
      const [checkRows] = await connection.execute(checkQuery, [formattedDate, time_state]);

      if (checkRows[0].count > 0) {
        return res.status(409).json({ error: 'Time slot already booked.' });
      }

      const query = `
        INSERT INTO service (FName, LName, phone_no, dent_cc, treatment_right, date_service, time_service, time_state, date_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        name,
        surname,
        phone,
        dentalService,
        treatmentRight,
        formattedDate,
        selectedTime,
        time_state,
        currentDateTime,
      ];

      await connection.execute(query, values);
      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Database Error:', error.message);
      res.status(500).json({ error: 'Failed to save data.' });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query; // ดึง id จาก URL
    const { status } = req.body; // ดึง status จาก request body

    if (!id || !status) {
      return res.status(400).json({ error: 'ID and status are required.' });
    }

    let connection;

    try {
      connection = await createDBConnection();

      // อัปเดตสถานะในตาราง service
      const query = `
        UPDATE service
        SET status = ?
        WHERE id = ?
      `;
      await connection.execute(query, [status, id]);

      return res.status(200).json({ message: 'Status updated successfully!' });
    } catch (error) {
      console.error('Database Error:', error.message);
      res.status(500).json({ error: 'Failed to update status.' });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } else if (req.method === 'POST_ACTION') {
    const { queueId, status } = req.body;

    if (!queueId || !status) {
      return res.status(400).json({ error: 'Queue ID and status are required.' });
    }

    const currentDateTime = getCurrentDateTime();
    let connection;

    try {
      connection = await createDBConnection();

      // ดึงข้อมูลคิวที่ต้องการจาก `service`
      const query = `SELECT * FROM service WHERE id = ?`;
      const [rows] = await connection.execute(query, [queueId]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Queue not found.' });
      }

      const queueData = rows[0];
      queueData.status = status; // เพิ่มสถานะ
      queueData.date_time = currentDateTime; // เพิ่มวันที่ปัจจุบันสำหรับบันทึกใน history

      // บันทึกลง `history`
      await insertHistory(connection, queueData);

      return res.status(200).json({ message: 'History recorded successfully!' });
    } catch (error) {
      console.error('Database Error:', error.message);
      res.status(500).json({ error: 'Failed to record history.' });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'POST_ACTION']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
