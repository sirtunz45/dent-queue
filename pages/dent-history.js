import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavBarAdmin from './components/navbar2';
import Image from 'next/image';

function DentHistory() {
  const [queueData, setQueueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [daysInMonth, setDaysInMonth] = useState(31);

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ];

  const mapTimeServiceToState = (time_service) => {
    const timeMap = {
      "09.00 - 10.00": 1,
      "10.00 - 11.00": 2,
      "11.00 - 12.00": 3,
      "13.00 - 14.00": 4,
      "14.00 - 15.00": 5,
      "15.00 - 16.00": 6,
    };
    return timeMap[time_service] || null;
  };

  const fetchQueueData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/db');
  
      // กรองเฉพาะคิวที่ยังไม่ดำเนินการ
      const pendingQueue = response.data.data.filter(queue => 
        queue.status !== "ยังไม่ดำเนินการ" 
      );
  
      setQueueData(pendingQueue);
      setFilteredData(pendingQueue);
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

  const formatThaiDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const thaiYear = parseInt(year, 10) + 543;
    const thaiMonth = months[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)} ${thaiMonth} ${thaiYear}`;
  };

  const handleSearch = (event) => {
      const query = event.target.value.toLowerCase();
      setSearchQuery(query);
      filterData(query, selectedDay, selectedMonth, selectedYear);
    };
  
    const handleDayChange = (event) => {
      const day = event.target.value;
      setSelectedDay(day);
      filterData(searchQuery, day, selectedMonth, selectedYear);
    };
  
    const getDaysInMonth = (month, year) => {
      if (!month) return 31;
      const monthIndex = parseInt(month) - 1;
      return new Date(year || new Date().getFullYear(), monthIndex + 1, 0).getDate();
    };
  
    useEffect(() => {
      // อัปเดตจำนวนวันเมื่อเดือนหรือปีเปลี่ยน
      if (selectedMonth && selectedYear) {
        setDaysInMonth(getDaysInMonth(selectedMonth, selectedYear));
        if (selectedDay > daysInMonth) {
          setSelectedDay(""); // รีเซ็ตวันที่หากเกินจำนวนวันของเดือนนั้น
        }
      }
    }, [selectedMonth, selectedYear, daysInMonth, selectedDay]);
  
    const handleMonthChange = (event) => {
      const month = event.target.value;
      setSelectedMonth(month);
      const updatedDays = getDaysInMonth(month, selectedYear);
      setDaysInMonth(updatedDays);
      filterData(searchQuery, selectedDay, month, selectedYear);
    };
  
    const handleYearChange = (event) => {
      const year = event.target.value;
      setSelectedYear(year);
      const updatedDays = getDaysInMonth(selectedMonth, year);
      setDaysInMonth(updatedDays);
      filterData(searchQuery, selectedDay, selectedMonth, year);
    };
  
    const filterData = (query, day, month, year) => {
      const filtered = queueData.filter((item) => {
        const itemDate = new Date(item.date_service);
        const itemDay = itemDate.getDate();
        const itemMonth = itemDate.getMonth() + 1;
        const itemYear = itemDate.getFullYear();
  
        const matchesQuery =
          item.FName.toLowerCase().includes(query) ||
          item.LName.toLowerCase().includes(query) ||
          item.phone_no.toLowerCase().includes(query);
  
        const matchesDay = day ? itemDay === parseInt(day) : true;
        const matchesMonth = month ? itemMonth === parseInt(month) : true;
        const matchesYear = year ? itemYear === parseInt(year) : true;
  
        return matchesQuery && matchesDay && matchesMonth && matchesYear;
      });
      setFilteredData(filtered);
    };
  
  {/*<p><b>สถานะ:</b> ${queue.status}</p>*/}

  const handleViewDetails = async (queue) => {
  await Swal.fire({
    icon: 'info',
    title: 'รายละเอียด',
    html: `
      <button aria-label="Close" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
      <p><b>ID:</b> ${queue.id}</p>
      <p><b>สถานะ:</b> ${queue.status ? queue.status : 'ไม่ระบุ'}</p>
      <p><b>สถานะการตั้งครรภ์:</b> ${queue.pregnant}</p>
      <p><b>วันที่เป็นประจำเดือนวันสุดท้าย:</b> ${queue.last_period ? formatThaiDate(queue.last_period.split('T')[0]) : 'ไม่ระบุ'}</p>
      <p><b>บริการ:</b> ${queue.dent_cc}</p>
      <p><b>สิทธิการรักษา:</b> ${queue.treatment_right}</p>
      <p><b>วันที่บริการ:</b> ${formatThaiDate(queue.date_service.split('T')[0])} </p>
      <p><b>ช่วงเวลา:</b> ${queue.time_service}</p>
      <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
        <button id="confirmBtn" style="padding: 10px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">ดำเนินการแล้ว</button>
        <button id="cancelBtn" style="padding: 10px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">ยกเลิกคิว</button>
      </div>
    `,
    showConfirmButton: false,
    didOpen: () => {
      document.querySelector('[aria-label="Close"]').onclick = () => Swal.close();
      document.getElementById('confirmBtn').onclick = async () => {
        await updateQueueStatus(queue.id, 'completed');
        Swal.close();
      };
      document.getElementById('cancelBtn').onclick = async () => {
        await updateQueueStatus(queue.id, 'canceled');
        Swal.close();
      };
    },
  });
};

const updateQueueStatus = async (id, status) => {
  try {
    await axios.put(`/api/db/${id}`, { status });
    Swal.fire({
      icon: 'success',
      title: 'อัปเดตสถานะสำเร็จ',
      text: `คิวถูกเปลี่ยนเป็นสถานะ: ${status === 'completed' ? 'ดำเนินการแล้ว' : 'ยกเลิกคิว'}`,
    });
    fetchQueueData();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถอัปเดตสถานะคิวได้',
    });
    console.error('Error updating queue status:', error);
  }
};

  return (
    <div style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, overflow: 'hidden' }}>
      <div style={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1 }}>
        <NavBarAdmin />
      </div>

      <div style={{ display: 'flex', paddingTop: '70px', minHeight: '100vh' }}>
        <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Image
              src="/dent.png"  // ใช้ path ที่ถูกต้องของภาพ
              alt="Dentistry Image"
              width={80}  // กำหนดความกว้างของภาพ
              height={80}  // กำหนดความสูงของภาพ
              style={{ marginTop: '20px', marginBottom: '10px' }}  // ใช้ style ตามที่กำหนด
            />
            <h2>ประวัติทันตกรรม</h2>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="ค้นหา ชื่อ, นามสกุล หรือ เบอร์โทร"
                value={searchQuery}
                onChange={handleSearch}
                style={{
                  width: '60%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
            <select 
                onChange={handleDayChange} 
                value={selectedDay}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
              <option value="">เลือกวันที่</option>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <select 
                onChange={handleMonthChange} 
                value={selectedMonth} 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} > 
              <option value="">เลือกเดือน</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select 
                onChange={handleYearChange} 
                value={selectedYear} 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} >
              <option value="">เลือกปี</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year + 543}
                </option>
              ))}
            </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p>ไม่พบข้อมูลที่ค้นหา</p>
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
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>วันที่บริการ</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>ช่วงเวลา</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>สถานะ</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>จัดการ</th>
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
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {formatThaiDate(queue.date_service.split('T')[0])}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{queue.time_service}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', color: queue.status === 'ดำเนินการแล้ว' ? 'green' : queue.status === 'ยกเลิกคิว' ? 'red' : 'black' }}>
                      {queue.status}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleViewDetails(queue)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '5px',
                          backgroundColor: '#FF69B4',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          marginRight: '5px',
                        }}
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
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

export default DentHistory;
