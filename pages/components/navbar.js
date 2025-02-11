import React from 'react';

function NavBar() {
    return (
        <div style={{ backgroundColor: '#9ad9db', color: '#000', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="dent.png" alt="Dentistry Image" style={{ width: '40px' }} />
                <div style={{ fontSize: '20px' }}>คลินิกทันตกรรม</div>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
                <a href="/" style={{ color: '#000', textDecoration: 'none' }}>หน้าแรก</a>
                <a href="/check-queue" style={{ color: '#000', textDecoration: 'none' }}>ตรวจสอบคิว</a>
                <a href="/admin-login" style={{ color: '#000', textDecoration: 'none' }}>สำหรับเจ้าหน้าที่</a>
            </div>
        </div>
    );
}

export default NavBar;
