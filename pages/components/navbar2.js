import React from 'react';

function NavBarAdmin() {
    return (
        <div style={{ backgroundColor: '#9ad9db', color: '#000', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="dent.png" alt="Dentistry Image" style={{ width: '40px' }} />
                <div style={{ fontSize: '20px' }}>คลินิกทันตกรรม</div>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
                <a href="/main-admin" style={{ color: '#000', textDecoration: 'none' }}>หน้าแรก</a>
                <a href="/admin-check-queue" style={{ color: '#000', textDecoration: 'none' }}>รายการทันตกรรม</a>
                <a href="/dent-history" style={{ color: '#000', textDecoration: 'none' }}>ประวัติทันตกรรม</a>
                <a href="/admin-login" style={{ color: '#000', textDecoration: 'none' }}>ออกจากระบบ</a>
            </div>
        </div>
    );
}

export default NavBarAdmin;
