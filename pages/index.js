import React from 'react';
import NavBar from './components/navbar';
import Link from 'next/link';
import Image from 'next/image';

function Main() {
    return (
        <div style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, overflow: 'hidden' }}>
            {/* Top Menu */}
            <div style={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1 }}>
                <NavBar />
            </div>

            <div style={{ display: 'flex', paddingTop: '70px', minHeight: '100vh' }}>
                {/* Sidebar */}

                <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', paddingTop: '20px', overflowY: 'auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px', marginLeft:'0px'}}>
                        <Image
                            src="/dent.png"  // ใช้ path ที่ถูกต้องของภาพ
                            alt="Dentistry Image"
                            width={80}  // กำหนดความกว้างของภาพ
                            height={80}  // กำหนดความสูงของภาพ
                            style={{ marginTop: '20px', marginBottom: '10px' }}  // ใช้ style ตามที่กำหนด
                        />
                        <h2>คลินิกทันตกรรม</h2>
                    </div>

                    {/* Search Bar */}
                    {/*<div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <input 
                            type="text" 
                            placeholder="ค้นหา" 
                            style={{ width: '60%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>*/}
                    <Link href="/select-gender"  style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <button style={{
                                width: '60%', 
                                padding: '15px', 
                                margin: '5px 0',
                                backgroundColor: '#e6e6e6', 
                                borderRadius: '5px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                border: 'none', // ลบเส้นขอบของปุ่ม
                                fontSize: '16px',
                                
                            }}>
                                จองคิวทันตกรรม
                            </button>
                        </div>
                    </Link>
                    <div style={{ textAlign: 'center', marginBottom: '20px', marginLeft:'0px'}}>
                        <Image
                            src="/dentist.png"  // ใช้ path ที่ถูกต้องของภาพ
                            alt="Dentist Image"
                            width={500}  // กำหนดความกว้างของภาพ
                            height={500}  // กำหนดความสูงของภาพ
                            style={{ marginTop: '50px', marginBottom: '100px' }}  // ใช้ style ตามที่กำหนด
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Main;
