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
                DATE_FORMAT(date_service, '%Y-%m-%d') AS date_service, 
                time_service, pregnant, last_period, status
          FROM service
        `;
        const [rows] = await connection.execute(query);
        {/*console.log("API Response:", rows);*/} //เช็คค่าที่ดึงมาแสดง
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
      isPregnant,
      lastPeriodDate
    } = req.body;

    // ✅ LOG เช็คค่าที่ API ได้รับ
    console.log("Received Data in API:", {
      name,
      surname,
      phone,
      dentalService,
      treatmentRight,
      confirmedDate,
      selectedTime,
      time_state,
      isPregnant,
      lastPeriodDate
    });

    if (
      !name ||
      !surname ||
      !phone ||
      !dentalService ||
      !treatmentRight ||
      !confirmedDate ||
      !selectedTime ||
      !time_state ||
      !isPregnant
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    let formattedDate;
    try {
      formattedDate = convertThaiDateToISO(confirmedDate);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    let formattedLastPeriodDate = null;
    if (lastPeriodDate && lastPeriodDate !== '') {
      try {
        formattedLastPeriodDate = new Date(lastPeriodDate).toISOString().split("T")[0];
      } catch (err) {
        console.error("Error formatting lastPeriodDate:", err);
        return res.status(400).json({ error: 'Invalid lastPeriodDate format.' });
      }
    }

    // ✅ LOG ตรวจสอบค่าก่อน INSERT
    console.log("Checking values before insert:", {
      isPregnant: isPregnant || "ไม่ระบุ",
      lastPeriodDate: formattedLastPeriodDate || null
    });

    const currentDateTime = getCurrentDateTime();
    let connection;

    try {
      connection = await createDBConnection();

      const query = `
    INSERT INTO service (FName, LName, phone_no, dent_cc, treatment_right, date_service, time_service, time_state, date_time, pregnant, last_period, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        isPregnant || "ไม่ระบุ",  // ✅ ตั้งค่า "ไม่ระบุ" ถ้าไม่มีค่า
        formattedLastPeriodDate || null,  // ✅ ตั้งค่า NULL ถ้าไม่มีค่า
        "ยังไม่ดำเนินการ" // ✅ เพิ่มสถานะเริ่มต้นเป็น "ยังไม่ดำเนินการ"
    ];

    await connection.execute(query, values);

      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Database Error:', error);
      res.status(500).json({ error: 'Failed to save data.', details: error.message });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query; // ดึง ID จาก URL
    const { status, time_state } = req.body; // ดึง status และ time_state จาก body

    if (!id || !status || time_state === undefined) {
      return res.status(400).json({ error: 'ID, status, และ time_state จำเป็นต้องมี' });
    }

    let connection;

    try {
      connection = await createDBConnection();

      const query = `
  UPDATE service
  SET status = ?, time_state = ?
  WHERE id = ?
`;

console.log("คำสั่ง SQL ที่จะถูกเรียกใช้:", query); // เช็คคำสั่ง SQL
await connection.execute(query, [status, time_state, id]);



      return res.status(200).json({ message: 'อัปเดตสถานะและ time_state สำเร็จ!' });
    } catch (error) {
      console.error('Database Error:', error.message);
      res.status(500).json({ error: 'ไม่สามารถอัปเดตสถานะและ time_state ได้' });
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
