import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavBar from './components/navbar';
import Image from 'next/image';

function CheckQueue() {
  const [queueData, setQueueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [firstNameQuery, setFirstNameQuery] = useState('');
  const [lastNameQuery, setLastNameQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ];

  const formatThaiDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const thaiYear = parseInt(year, 10) + 543;
    const thaiMonth = months[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)} ${thaiMonth} ${thaiYear}`;
  };

  // ฟังก์ชันสำหรับดึงข้อมูลคิวจาก API
  const fetchQueueData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/db'); 
      setQueueData(response.data.data);
      setFilteredData([]); // ไม่แสดงข้อมูลจนกว่าจะมีการค้นหา
    } catch (error) {
      console.error('Error fetching queue data:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถดึงข้อมูลคิวได้',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, []);

  // ฟังก์ชันจัดการการค้นหา
  const handleSearch = () => {
    if (firstNameQuery.trim() === '' && lastNameQuery.trim() === '' && phoneQuery.trim() === '') {
      setFilteredData([]); // หากไม่มีการกรอกข้อมูล ให้ยังคงว่างเปล่า
      return;
    }

    const filtered = queueData
      .filter((item) => {
        return (
          item.FName.toLowerCase().includes(firstNameQuery.toLowerCase()) &&
          item.LName.toLowerCase().includes(lastNameQuery.toLowerCase()) &&
          item.phone_no.toLowerCase().includes(phoneQuery.toLowerCase())
        );
      })
      .map((item) => ({
        ...item,
        FName: item.FName.slice(0, 3) + 'xxx',
        LName: item.LName.slice(0, 2) + 'xxx',
        phone_no: item.phone_no.slice(0, 3) + 'xxxxxxx',
      }));

    setFilteredData(filtered);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, overflow: 'hidden' }}>
      <div style={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1 }}>
        <NavBar />
      </div>

      <div style={{ display: 'flex', paddingTop: '70px', minHeight: '100vh' }}>
        <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Image
              src="/dent.png"  // ใช้ path ที่ถูกต้องของภาพ
              alt="Dentistry Image"
              width={80}  // กำหนดความกว้างของภาพ
              height={80}  // กำหนดความสูงของภาพ
              style={{ marginTop: '50px', marginBottom: '10px' }}  // ใช้ style ตามที่กำหนด
            />
            <h2>ตรวจสอบคิว</h2>

            {/* ช่องค้นหา */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="ชื่อ"
                value={firstNameQuery}
                onChange={(e) => setFirstNameQuery(e.target.value)}
                style={{
                  width: '30%',
                  padding: '10px',
                  marginRight: '5px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <input
                type="text"
                placeholder="นามสกุล"
                value={lastNameQuery}
                onChange={(e) => setLastNameQuery(e.target.value)}
                style={{
                  width: '30%',
                  padding: '10px',
                  marginRight: '5px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <input
                type="text"
                placeholder="เบอร์โทร"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                style={{
                  width: '30%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  padding: '10px 20px',
                  marginLeft: '10px',
                  borderRadius: '5px',
                  backgroundColor: '#fe1d93',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
              >
                ค้นหา
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : filteredData.length === 0 && (firstNameQuery.trim() === '' && lastNameQuery.trim() === '' && phoneQuery.trim() === '') ? (
            <div style={{ textAlign: 'center' }}>
              <p>กรุณากรอก ชื่อ นามสกุลและเบอร์โทรศัพท์ เพื่อแสดงข้อมูล</p>
            </div>
          ): filteredData.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p>กรุณากรอก ชื่อ นามสกุลและเบอร์โทรศัพท์ เพื่อแสดงข้อมูล</p>
            </div> 
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: 'pink' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>No</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>ชื่อ</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>นามสกุล</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>เบอร์โทร</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>บริการ</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>สิทธิการรักษา</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>วันที่บริการ</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>ช่วงเวลา</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((queue, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{queue.FName}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{queue.LName}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{queue.phone_no}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{queue.dent_cc}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{queue.treatment_right}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {formatThaiDate(queue.date_service.split('T')[0])}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{queue.time_service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckQueue;
