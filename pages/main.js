import React from 'react';

function Main() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            {/* Sidebar */}
            <div style={{ width: '20%', backgroundColor: '4b0082#', color: '#fff', padding: '20px' }}>
                <div style={{ fontSize: '24px', marginBottom: '20px' }}>1</div>
                <div style={{ fontSize: '18px' }}>ทันตกรรม</div>
                <div>เลือกสำนักงานที่ต้องการ</div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, backgroundColor: '#f5f5f5', padding: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img src="logo-url" alt="DLT Smart Queue Logo" style={{ marginBottom: '10px' }} />
                    <h2>เลือกสำนักงาน</h2>
                    <p>เลือกสำนักงานที่ต้องการ</p>
                </div>

                {/* Search Bar */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="ค้นหา" 
                        style={{ width: '60%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                {/* Office List */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        width: '60%', 
                        padding: '15px', 
                        margin: '5px 0', 
                        backgroundColor: '#e6e6e6', 
                        borderRadius: '5px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}>
                        สำนักงานขนส่งพื้นที่ 1 (บางขุนเทียน)
                    </div>
                    <div style={{
                        width: '60%', 
                        padding: '15px', 
                        margin: '5px 0', 
                        backgroundColor: '#e6e6e6', 
                        borderRadius: '5px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}>
                        สำนักงานขนส่งพื้นที่ 2 (ตลิ่งชัน)
                    </div>
                    <div style={{
                        width: '60%', 
                        padding: '15px', 
                        margin: '5px 0', 
                        backgroundColor: '#e6e6e6', 
                        borderRadius: '5px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}>
                        สำนักงานขนส่งพื้นที่ 3 (พระโขนง)
                    </div>
                    <div style={{
                        width: '60%', 
                        padding: '15px', 
                        margin: '5px 0', 
                        backgroundColor: '#e6e6e6', 
                        borderRadius: '5px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}>
                        สำนักงานขนส่งพื้นที่ 4 (หนองจอก)
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
