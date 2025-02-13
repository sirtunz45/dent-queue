import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from './components/navbar';
import Swal from 'sweetalert2';
import Image from 'next/image';

function SelectPregnant() {
    const router = useRouter();
    const [selectedGender, setSelectedGender] = useState('');

    const handleSelection = (event) => {
        setSelectedGender(event.target.value);
    };

    const handleProceed = () => {
        if (selectedGender === 'pregnant') {
            router.push('/queue-women-is-pregnant');
        } else if (selectedGender === 'not-pregnant') {
            router.push('/queue-women-not-pregnant');
        } else {
            alert('โปรดเลือกเพศก่อนดำเนินการ');
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1 }}>
                <NavBar />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 100px)', flexDirection: 'column' }}>
                <Image
                    src="/dent.png"  // ใช้ path ที่ถูกต้องของภาพ
                    alt="Dentistry Image"
                    width={80}  // กำหนดความกว้างของภาพ
                    height={80}  // กำหนดความสูงของภาพ
                    style={{ marginTop: '20px', marginBottom: '10px' }}  // ใช้ style ตามที่กำหนด
                />
                <h2>คลินิกทันตกรรม</h2>
                <h3>สถานะการตั้งครรภ์</h3>
                <select
                    value={selectedGender}
                    onChange={handleSelection}
                    style={{ padding: '10px', margin: '10px 0', fontSize: '16px',borderRadius: '5px' }}
                >
                    <option value="">-- โปรดเลือก --</option>
                    <option value="pregnant">ตั้งครรภ์</option>
                    <option value="not-pregnant">ไม่ตั้งครรภ์</option>
                </select>
                <button
                    onClick={handleProceed}
                    style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '5px', backgroundColor: '#fe1d93', color:'#fff', border: 'none' }}
                >
                    ยืนยัน
                </button>
            </div>
        </div>
    );
}

export default SelectPregnant;
