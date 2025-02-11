const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'dent_queue'
});

db.connect((err) => {
  if (err) throw err;
  console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
});

app.post('/api/bookings', (req, res) => {
  const { name, surname, phone, dentalService, confirmedDate, selectedTime } = req.body;
  const sql = 'INSERT INTO service (FName, LName, phone_no, dent_cc, date_service, time_service, date_time) VALUES (?, ?, ?, ?, ?, ?, NOW())';
  db.query(sql, [name, surname, phone, dentalService, confirmedDate, selectedTime], (err, result) => {
    if (err) {
      console.error('เกิดข้อผิดพลาด:', err);
      res.status(500).json({ message: 'บันทึกข้อมูลไม่สำเร็จ' });
    } else {
      res.status(200).json({ message: 'บันทึกข้อมูลสำเร็จ' });
    }
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
