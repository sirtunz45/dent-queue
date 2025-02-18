import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function NavBarAdmin() {
    return (
        <div style={{ backgroundColor: '#9ad9db', color: '#000', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/main-admin" style={{ color: '#000', textDecoration: 'none' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Image
                    src="/dent.png"  // ใช้ path ที่ถูกต้องของภาพ
                    alt="Dentistry Image"
                    width={40}  // กำหนดความกว้างของภาพ
                    height={40}  // กำหนดความสูงของภาพ
                />
                    <div style={{ fontSize: '20px' }}>คลินิกทันตกรรม</div> 
                </div>
            </Link> 
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link href="/main-admin" style={{ color: '#000', textDecoration: 'none' }}>หน้าแรก</Link>
                <Link href="/admin-check-queue" style={{ color: '#000', textDecoration: 'none' }}>รายการทันตกรรม</Link>
                <Link href="/dent-history" style={{ color: '#000', textDecoration: 'none' }}>ประวัติทันตกรรม</Link>
                <Link href="/admin-login" style={{ color: '#000', textDecoration: 'none' }}>ออกจากระบบ</Link>
            </div>
        </div>
    );
}

export default NavBarAdmin;
