import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavBarAdmin from './components/navbar2';
import Image from 'next/image';

function AdminCheckQueue() {
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
        queue.status !== "ดำเนินการแล้ว" && queue.status !== "ยกเลิกคิว"
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
          await updateQueueStatus(queue.id, 'ดำเนินการแล้ว', queue.time_state);
        };
        document.getElementById('cancelBtn').onclick = async () => {
          // ส่งคำขอ PUT ไปกับ time_state = 0
          await updateQueueStatus(queue.id, 'ยกเลิกคิว', 0); // ส่งค่า time_state เป็น 0
        };
      },
    });
  };
  

  const updateQueueStatus = async (id, status, time_state) => {
    console.log("ส่งค่าไปที่ API:", { id, status, time_state }); // เช็คค่าที่ส่งไป
    try {
      const response = await axios.put(`/api/db/${id}`, { status, time_state });
      console.log("Response จาก API:", response); // ตรวจสอบการตอบกลับจาก API
      await Swal.fire({
        icon: 'success',
        title: 'อัปเดตสถานะสำเร็จ',
      });
      fetchQueueData();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถอัปเดตสถานะคิวได้',
      });
      console.error('Error updating queue status:', error);
    }
  };
  
  
  
  const handleEditDetails = async (queue) => {
    const { value: formValues } = await Swal.fire({
      title: 'แก้ไขข้อมูล',
      width: '700',
      html: `
        <button aria-label="Close" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
          <div style="display: flex; align-items: center; width: 100%;">
            <label for="id" style="width: 150px; text-align: left;">ID:</label>
            <input id="id" class="swal2-input" value="${queue.id}" style="width: calc(100% - 120px); height: 40px; border-radius: 5px;" />
          </div>
          <div style="display: flex; align-items: center; width: 100%;">
            <label for="FName" style="width: 150px; text-align: left;">ชื่อ:</label>
            <input id="FName" class="swal2-input" value="${queue.FName}" style="width: calc(100% - 120px); height: 40px; border-radius: 5px;" />
          </div>
          <div style="display: flex; align-items: center; width: 100%;">
            <label for="LName" style="width: 150px; text-align: left;">นามสกุล:</label>
            <input id="LName" class="swal2-input" value="${queue.LName}" style="width: calc(100% - 120px); height: 40px; border-radius: 5px;" />
          </div>
          <div style="display: flex; align-items: center; width: 100%;">
            <label for="phone_no" style="width: 150px; text-align: left;">เบอร์โทร:</label>
            <input id="phone_no" class="swal2-input" value="${queue.phone_no}" style="width: calc(100% - 120px); height: 40px; border-radius: 5px;" maxlength="10" />
          </div>
          <div style="display: flex; align-items: center; width: 100%;">
            <label for="dent_cc" style="width: 150px; text-align: left;">บริการ:</label>
            <input id="dent_cc" class="swal2-input" value="${queue.dent_cc}" style="width: calc(100% - 120px); height: 40px; border-radius: 5px;" />
          </div>
          <div style="display: flex; align-items: center; width: 100%; ">
            <label for="date_service" style="width: 150px; text-align: left;">วันที่บริการ:</label>
            <input id="date_service" class="swal2-input" type="date" value="${queue.date_service.split('T')[0]}" style="width: calc(100% - 120px); height: 40px; border-radius: 5px;" />
          </div>
           <div style="display: flex; align-items: center; width: 100%; ">
            <label for="last_period" style="width: 150px; text-align: left;">วันที่เป็นประจำเดือนวันสุดท้าย:</label>
            <input id="last_period" class="swal2-input" type="date" value="${queue.last_period ? (queue.last_period.split('T')[0]) : 'null'}" style="width: calc(100% - 120px); height: 40px; border-radius: 5px;" />
          </div>
          <div style="display: flex; align-items: center; width: 100%; ">
            <label for="pregnant" style="width: 150px; text-align: left;">สถานะการตั้งครรภ์:</label>
            <select id="pregnant" class="swal2-input" style="width: calc(91% - 120px); height: 40px; border-radius: 5px; font-size: 20px; text-align: left; padding: 0 10px; border: 1px solid #ccc; ">
              <option value="ตั้งครรภ์" ${queue.pregnant === "ตั้งครรภ์" ? "selected" : ""}>ไม่ระบุ</option>
              <option value="ตั้งครรภ์" ${queue.pregnant === "ตั้งครรภ์" ? "selected" : ""}>ตั้งครรภ์</option>
              <option value="ไม่ตั้งครรภ์" ${queue.pregnant === "ไม่ตั้งครรภ์" ? "selected" : ""}>ไม่ตั้งครรภ์</option>
            </select>
          </div>
          <div style="display: flex; align-items: center; width: 100%; ">
            <label for="treatment_right" style="width: 150px; text-align: left;">สิทธิการรักษา:</label>
            <select id="treatment_right" class="swal2-input" style="width: calc(91% - 120px); height: 40px; border-radius: 5px; font-size: 20px; text-align: left; padding: 0 10px; border: 1px solid #ccc; ">
              <option value="สิทธิประกันสังคม" ${queue.treatment_right === "สิทธิประกันสังคม" ? "selected" : ""}>สิทธิประกันสังคม</option>
              <option value="สิทธิข้าราชการ" ${queue.treatment_right === "สิทธิข้าราชการ" ? "selected" : ""}>สิทธิข้าราชการ</option>
              <option value="สิทธิอื่นๆ" ${queue.treatment_right === "สิทธิอื่นๆ" ? "selected" : ""}>สิทธิอื่นๆ</option>
            </select>
          </div>
          
          <div style="display: flex; align-items: center; width: 100%;">
            <label for="time_service" style="width: 150px; text-align: left;">ช่วงเวลา:</label>
            <select id="time_service" class="swal2-input" style="width: calc(91% - 120px); height: 40px; border-radius: 5px; font-size: 20px; text-align: center;">
              <option value="09.00 - 10.00" ${queue.time_service === "09.00 - 10.00" ? "selected" : ""}>09.00 - 10.00</option>
              <option value="10.00 - 11.00" ${queue.time_service === "10.00 - 11.00" ? "selected" : ""}>10.00 - 11.00</option>
              <option value="11.00 - 12.00" ${queue.time_service === "11.00 - 12.00" ? "selected" : ""}>11.00 - 12.00</option>
              <option value="13.00 - 14.00" ${queue.time_service === "13.00 - 14.00" ? "selected" : ""}>13.00 - 14.00</option>
              <option value="14.00 - 15.00" ${queue.time_service === "14.00 - 15.00" ? "selected" : ""}>14.00 - 15.00</option>
              <option value="15.00 - 16.00" ${queue.time_service === "15.00 - 16.00" ? "selected" : ""}>15.00 - 16.00</option>
            </select>
          </div>
        </div>`,
      confirmButtonText: 'บันทึก',
      confirmButtonColor: '#28a745',
      focusConfirm: false,
      preConfirm: () => {
        const time_service = document.getElementById("time_service").value;
        return {
          FName: document.getElementById("FName").value,
          LName: document.getElementById("LName").value,
          phone_no: document.getElementById("phone_no").value,
          pregnant: document.getElementById("pregnant").value,
          last_period: document.getElementById("last_period").value,
          dent_cc: document.getElementById("dent_cc").value,
          treatment_right : document.getElementById("treatment_right").value,
          date_service: document.getElementById("date_service").value,
          time_service: time_service,
          time_state: mapTimeServiceToState(time_service),
        };
      },
      didOpen: () => {
        document.querySelector('[aria-label="Close"]').onclick = () => Swal.close();
      },
    });
  
    if (formValues) {
      try {
        console.log("Updating queue with ID:", queue.id);
        const response = await axios.put(`/api/db/${queue.id}`, formValues);
        console.log("Update response:", response);
  
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลสำเร็จ",
        });
  
        fetchQueueData(); // รีโหลดข้อมูลหลังจากอัปเดตสำเร็จ
      } catch (error) {
        console.error("Error updating queue:", error.response || error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
        });
      }
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
            <h2>รายการทันตกรรม</h2>
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
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{queue.status}</td>
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
                      <button
                        onClick={() => handleEditDetails(queue)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '5px',
                          backgroundColor: '#FFCC00',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        แก้ไข
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

export default AdminCheckQueue;
