import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from './components/navbar';
import Swal from 'sweetalert2';
import axios from 'axios';
import md5 from 'md5';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const hashedPassword = md5(password);  // แปลงรหัสผ่านเป็น md5

        // ตรวจสอบข้อมูลก่อนส่งคำขอ
        console.log("Sending POST request with data:", { username, password: hashedPassword });

        try {
            // ส่งคำขอไปยัง API เฉพาะ username และ password
            const response = await axios.post('/api/check-login', {
                username: username,
                password: hashedPassword
            });

            console.log("Response from API:", response);  // ตรวจสอบการตอบกลับจาก API

            if (response.data.message === 'Login successful') {
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'เข้าสู่ระบบสำเร็จ',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1200
                });
                setTimeout(() => {
                    router.push('/admin-check-queue'); // Redirect to the desired page
                }, 1000);
            } else {
                setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (error) {
            console.error("Error in POST request:", error);  // เพิ่มการตรวจสอบข้อผิดพลาด
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
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
                <h3>เข้าสู่ระบบ</h3>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
                    <input
                        type="text"
                        placeholder="ชื่อผู้ใช้"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ padding: '10px', fontSize: '16px', borderRadius: '5px' }}
                    />
                    <input
                        type="password"
                        placeholder="รหัสผ่าน"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '10px', fontSize: '16px', borderRadius: '5px' }}
                    />
                    {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
                    <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#fe1d93', color: '#fff', border: 'none', cursor: 'pointer',borderRadius: '5px' }}>
                        เข้าสู่ระบบ
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
