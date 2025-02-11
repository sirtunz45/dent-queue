import mysql from 'mysql2/promise';
import md5 from 'md5';

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
  if (req.method === 'POST') {
    const { username, password } = req.body;
    console.log("Data received on server:", { username, password }); // ตรวจสอบข้อมูลที่ได้รับ

    if (!username || !password) {
      return res.status(400).json({ error: 'Username และ Password ต้องไม่เป็นค่าว่าง' });
    }

    const hashedPassword = password; // แปลงรหัสผ่านเป็น MD5
    console.log(hashedPassword,username);
    let connection;
    try {
      connection = await createDBConnection();

      const query = `
        SELECT *
        FROM authenuser
        WHERE username = ? and password = ?
      `;

      const [rows] = await connection.execute(query,[username,hashedPassword]);

      if (rows.length > 0) {
        const user = rows[0];
        return res.status(200).json({ message: 'Login successful', user: { id: user.id, fname: user.fname, lname: user.lname, username: user.username, status: user.status } });
      } else {
        return res.status(400).json({ error: 'Username หรือ Password ไม่ถูกต้อง' });
      }
    } catch (error) {
      console.error('Database Error:', error.message);
      res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
