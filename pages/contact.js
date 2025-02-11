import { useState } from 'react';
import axios from 'axios';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus('อีเมลไม่ถูกต้อง');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/saveForm', {
        name,
        email,
        message,
      });

      if (response.status === 200) {
        setStatus('บันทึกข้อมูลเรียบร้อยแล้ว!');
        setName('');
        setEmail('');
        setMessage('');
        console.log(name);
      } else {
        setStatus('ไม่สามารถบันทึกข้อมูลได้');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('เกิดข้อผิดพลาด');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ฟอร์มติดต่อ</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}
      >
        <input
          type="text"
          placeholder="ชื่อ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="ชื่อ"
        />
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="อีเมล"
        />
        <textarea
          placeholder="ข้อความ"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          aria-label="ข้อความ"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px',
            backgroundColor: isSubmitting ? 'gray' : 'blue',
            color: 'white',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'กำลังส่ง...' : 'ส่ง'}
        </button>
      </form>
      {status && (
        <p style={{ color: status.includes('เรียบร้อย') ? 'green' : 'red' }}>
          {status}
        </p>
      )}
    </div>
  );
}
