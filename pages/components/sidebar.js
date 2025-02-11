import React from 'react';

function Sidebar() {
    return (
        <div style={{ 
            width: '10%', 
            backgroundColor: '#fe1d93', 
            color: '#fff', 
            padding: '20px', 
            height: '100vh',
            position: 'fixed',
            top: '90px', // ระยะห่างจาก Navbar
            left: 0 
        }}>
            <div style={{ fontSize: '18px' }}>รายการทันตกรรม</div>
            <div style={{paddingTop:'15px'}}>เลือกรายการทันตกรรมที่ต้องการ</div>
        </div>
    );
}

export default Sidebar;
