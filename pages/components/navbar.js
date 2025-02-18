import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function NavBar() {
    return (
        <div style={{ backgroundColor: '#9ad9db', color: '#000', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap : '25px' }}>
           <Link href="/" style={{ color: '#000', textDecoration: 'none' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Image
                    src="/dent.png"  // ใช้ path ที่ถูกต้องของภาพ
                    alt="Dentistry Image"
                    width={40}  // กำหนดความกว้างของภาพ
                    height={40}  // กำหนดความสูงของภาพ
                />
                    <div style={{ fontSize: '16px' }}>คลินิกทันตกรรม</div> 
                </div>
            </Link> 
            <div style={{ display: 'flex', gap: '25px', fontSize:'14px' }}>
                <Link href="/" style={{ color: '#000', textDecoration: 'none' }}>หน้าแรก</Link>
                <Link href="/check-queue" style={{ color: '#000', textDecoration: 'none' }}>ตรวจสอบคิว</Link>
                <Link href="/admin-login" style={{ color: '#000', textDecoration: 'none' }}>สำหรับเจ้าหน้าที่</Link>
            </div>
        </div>
    );
}

export default NavBar;
