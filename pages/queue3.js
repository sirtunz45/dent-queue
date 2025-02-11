import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavBar from './components/navbar';

function Queue() {
  const [month, setMonth] = useState(10); // พฤศจิกายน (เริ่มจาก 0)
  const [year, setYear] = useState(2567); // ปี พ.ศ.
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [confirmedDate, setConfirmedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [dentalService, setDentalService] = useState('');
  const [treatmentRight, setTreatmentRight] = useState('');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const timeStateMapping = {
    "09.00 - 10.00": 1,
    "10.00 - 11.00": 2,
    "11.00 - 12.00": 3,
    "13.00 - 14.00": 4,
    "14.00 - 15.00": 5,
    "15.00 - 16.00": 6,
  };

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  const getDaysInMonth = (month, year) => {
    if (month === 1) {
      return isLeapYear(year - 543) ? 29 : 28;
    }
    return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  };

  const getStartDayOfMonth = (month, year) => {
    const jsYear = year - 543;
    const firstDay = new Date(jsYear, month, 1);
    return firstDay.getDay();
  };

  const renderCalendar = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const startDay = getStartDayOfMonth(month, year);

    const calendarDays = [];
    for (let i = 0; i < startDay; i++) {
      calendarDays.push("");
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return calendarDays;
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const toggleCalendar = () => {
    const currentDate = new Date();
    setMonth(currentDate.getMonth());
    setYear(currentDate.getFullYear() + 543);
    setShowCalendar(!showCalendar);
  };

  const selectDate = (day) => {
    setSelectedDate(`${day} ${months[month]} ${year}`);
  };

  const confirmDate = () => {
    setConfirmedDate(selectedDate);
    setShowCalendar(false);
  };

  const handleConfirmBooking = () => {
    if (!name || !surname || !phone || !dentalService || !confirmedDate || !selectedTime || !treatmentRight) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบ',
        text: 'โปรดกรอกข้อมูลในทุกช่องก่อนยืนยันการจอง',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#fe1d93',
      });
      return;
    }

    if (!timeStateMapping[selectedTime]) {
      Swal.fire({
        icon: 'warning',
        title: 'เวลาที่เลือกไม่ถูกต้อง',
        text: 'กรุณาเลือกเวลาที่ถูกต้อง',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#fe1d93',
      });
      return;
    }

    setShowConfirmPopup(true);
  };

  const handleConfirmBookingPopup = async () => {
    setShowConfirmPopup(false);

    try {
      const time_state = timeStateMapping[selectedTime];
      const response = await axios.post('/api/db', {
        name,
        surname,
        phone,
        dentalService,
        confirmedDate,
        selectedTime,
        time_state,
        treatmentRight,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'จองคิวเรียบร้อยแล้ว',
          text: 'ระบบได้ทำการจองคิวเรียบร้อยแล้ว',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#28a745',
        });

        setName('');
        setSurname('');
        setPhone('');
        setDentalService('');
        setTreatmentRight('');
        setConfirmedDate(null);
        setSelectedTime(null);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถจองคิวได้ กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#dc3545',
        });
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถจองคิวได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#dc3545',
      });
    }
  };

  const calendar = renderCalendar(month, year);

  return (
    <div style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, overflow: 'hidden' }}>
      <div style={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1 }}>
        <NavBar />
      </div>

      <div style={{ display: 'flex', paddingTop: '70px', minHeight: '100vh' }}>
        <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src="dent.png"
              alt="Dentistry Image"
              style={{ marginTop: '20px', marginBottom: '10px', width: '80px' }}
            />
            <h2>จองคิวทันตกรรม</h2>
            <p>กรอกข้อมูลการจองคิว</p>
          </div>

          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="ชื่อ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '60%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="นามสกุล"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                style={{ width: '60%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <input
                type="number"
                placeholder="เบอร์โทรศัพท์"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10) {
                    setPhone(value);
                  }
                }}
                style={{ width: '60%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <select
                value={dentalService}
                onChange={(e) => setDentalService(e.target.value)}
                style={{
                  width: '60%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  color: dentalService ? 'black' : 'grey',
                  fontSize: '14px',
                  appearance: 'none',
                }}
              >
                <option value="">เลือกรายการทันตกรรม</option>
                <option value="ตรวจสุขภาพช่องปาก">ตรวจสุขภาพช่องปาก</option>
                <option value="ขูดหินปู">ขูดหินปูน</option>
                <option value="อุดฟัน">อุดฟัน</option>
                <option value="ถอนฟัน">ถอนฟัน</option>
                <option value="ขัดฟัน">ขัดฟัน</option>
                <option value="เคลือบฟูลออไรด์">เคลือบฟูลออไรด์</option>
                <option value="เคลือบหลุมร่องฟัน">เคลือบหลุมร่องฟัน</option>
              </select>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <select
                value={treatmentRight}
                onChange={(e) => setTreatmentRight(e.target.value)}
                style={{
                  width: '60%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  color: treatmentRight ? 'black' : 'grey',
                  fontSize: '14px',
                  appearance: 'none',
                }}
              >
                <option value="">สิทธิการรักษา</option>
                <option value="สิทธิประกันสังคม">สิทธิประกันสังคม (ไม่ต้องสำรองจ่าย)</option>
                <option value="สิทธิข้าราชการ">สิทธิข้าราชการ (นำใบเสร็จไปเบิกกับต้นสังกัด)</option>
                <option value="สิทธิอื่นๆ">สิทธิอื่นๆ (ชำระเงินเอง)</option>
              </select>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h4 style={{ margin: '0 10px 0 0' }}>เลือกวันที่</h4>
              <button
                onClick={toggleCalendar}
                style={{
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fe1d93',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                เลือกวันที่
              </button>
              {confirmedDate && (
                <span style={{ marginLeft: '10px', fontSize: '16px', color: 'grey' }}>
                  {confirmedDate}
                </span>
              )}
            </div>

            {showCalendar && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
                onClick={() => setShowCalendar(false)}
              >
                <div
                  style={{
                    backgroundColor: '#fff',
                    padding: '15px',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                    width: '400px',
                    maxWidth: '90vw',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#fe1d93',
                      marginBottom: '15px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
                      ❮
                    </button>
                    {months[month]} {year}
                    <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
                      ❯
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '10px' }}>
                    {['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'].map((day, i) => (
                      <div
                        key={i}
                        style={{
                          fontWeight: 'bold',
                          fontSize: '14px',
                          textAlign: 'center',
                          color: 'black',
                        }}
                      >
                        {day}
                      </div>
                    ))}
                    {calendar.map((day, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (!(index % 7 === 0 || index % 7 === 6) && day) {
                            selectDate(day);
                          }
                        }}
                        style={{
                          padding: '8px',
                          borderRadius: '50%',
                          backgroundColor:
                            selectedDate === `${day} ${months[month]} ${year}`
                              ? '#007bff'
                              : index % 7 === 0 || index % 7 === 6
                              ? 'red'
                              : '#f0f0f0',
                          color: selectedDate === `${day} ${months[month]} ${year}` ? 'white' : index % 7 === 0 || index % 7 === 6 ? 'white' : 'black',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '30px',
                          width: '30px',
                          margin: 'auto',
                          fontSize: '12px',
                          cursor: index % 7 === 0 || index % 7 === 6 || !day ? 'not-allowed' : 'pointer',
                          pointerEvents: index % 7 === 0 || index % 7 === 6 || !day ? 'none' : 'auto',
                        }}
                      >
                        {day || ""}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={confirmDate}
                      style={{
                        marginTop: '10px',
                        padding: '8px 16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        backgroundColor: '#fe1d93',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        width: '50%',
                      }}
                    >
                      ยืนยัน
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
              {Object.keys(timeStateMapping).map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: '10px 20px',
                    margin: '5px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    backgroundColor: selectedTime === time ? '#e676c5' : '#fe1d93',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {time}
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={handleConfirmBooking}
                style={{
                  padding: '15px 20px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fe1d93',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '15px',
                }}
              >
                ยืนยันการจองคิว
              </button>
            </div>

            {showConfirmPopup && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
                onClick={() => setShowConfirmPopup(false)}
              >
                <div
                  style={{
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                    width: '400px',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 style={{ color: '#fe1d93' }}>รายละเอียดการจอง</h3>
                  <p>ชื่อ: {name}</p>
                  <p>นามสกุล: {surname}</p>
                  <p>เบอร์โทรศัพท์: {phone}</p>
                  <p>รายการทันตกรรม: {dentalService}</p>
                  <p>สิทธิการรักษา: {treatmentRight}</p>
                  <p>วันที่: {confirmedDate}</p>
                  <p>เวลา: {selectedTime}</p>
                  <button
                    onClick={handleConfirmBookingPopup}
                    style={{
                      marginTop: '20px',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      backgroundColor: '#fe1d93',
                      color: '#fff',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    ยืนยันการจองคิว
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Queue;
