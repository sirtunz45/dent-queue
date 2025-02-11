import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body; // ข้อมูลจากฟอร์ม

    try {
      // สร้างการเชื่อมต่อกับ MySQL
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST, // โฮสต์ของฐานข้อมูล
        user: process.env.DB_USER, // ชื่อผู้ใช้
        password: process.env.DB_PASSWORD, // รหัสผ่าน
        database: process.env.DB_DATABASE, // ชื่อฐานข้อมูล
        port: process.env.DB_PORT || 3306, // พอร์ต (ค่าเริ่มต้น: 3306)
      });

      // คำสั่ง SQL สำหรับเพิ่มข้อมูล
      const query = `
        INSERT INTO contacts (name, email, message)
        VALUES (?, ?, ?)
      `;
      const values = [name, email, message];

      // เพิ่มข้อมูลลงในฐานข้อมูล
      await connection.execute(query, values);

      // ปิดการเชื่อมต่อ
      await connection.end();

      // ส่งข้อความตอบกลับเมื่อสำเร็จ
      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Error:', error.message);

      // ส่งข้อความตอบกลับเมื่อเกิดข้อผิดพลาด
      res.status(500).json({ error: 'Failed to save data.' });
    }
  } else {
    // ส่งข้อความตอบกลับเมื่อใช้ Method ไม่ถูกต้อง
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
