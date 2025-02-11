import React from 'react';

function QueueSidebar() {
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
            <div style={{ fontSize: '18px' }}>จองคิวทันตกรรม</div>
            <div style={{paddingTop:'15px'}}>กรอกข้อมูลทันตกรรม</div>
        </div>
    );
}

export default QueueSidebar;
