import React from 'react';
import NavBar from './components/navbar';
import Main from './index'; // Import Main Content Component

const MainPage = () => {
  return (
    <div className="grid-container">
    <div className="navbar">
      <NavBar />
    </div>
    <div> 
      <Main />
    </div>
  </div>
  );
};

export default MainPage;