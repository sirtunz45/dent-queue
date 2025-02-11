import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from './components/navbar';

function SelectGender() {
    const router = useRouter();
    const [selectedGender, setSelectedGender] = useState('');

    const handleSelection = (event) => {
        setSelectedGender(event.target.value);
    };

    const handleProceed = () => {
        if (selectedGender === 'male') {
            router.push('/queue-men');
        } else if (selectedGender === 'female') {
            router.push('/select-pregnant');
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
                <img
                    src="dent.png"
                    alt="Dentistry Image"
                    style={{ marginTop: '20px', marginBottom: '10px', width: '80px' }}
                />
                <h2>คลินิกทันตกรรม</h2>
                <h3>โปรดเลือกเพศ</h3>
                <select
                    value={selectedGender}
                    onChange={handleSelection}
                    style={{ padding: '10px', margin: '10px 0', fontSize: '16px',borderRadius: '5px' }}
                >
                    <option value="">-- เลือกเพศ --</option>
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
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

export default SelectGender;
