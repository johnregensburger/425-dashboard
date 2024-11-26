import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Front = () => {

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [fromValue, setFromValue] = React.useState(10);
const [toValue, setToValue] = React.useState(40);


const toggleSidebar = () => {
  setIsSidebarOpen(prevState => !prevState);
};

const fromPercent = (fromValue / 100) * 100;
const toPercent = (toValue / 100) * 100;

 const navigate = useNavigate();

 const logOut = () => {
  setIsLoggedIn((prevState) => !prevState);
   navigate('/'); // Navigate to the Login page
 };

 const logIn = () => {
  navigate('/'); // Navigate to the Login page
 }

 const goToLibrary = () => {
  // navigate('/library');
 }

 console.log('Front Page component rendered!');
   return ( 
     <div className={`app ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Header Section */}
      <header>
        <div className="header-left">
          <button className="open-btn" onClick={toggleSidebar}>
            ☰ Filter
          </button>
        </div>
        <div className="header-right">
        {isLoggedIn ? (
            <button className="header-btn" onClick={goToLibrary}>
                Library {/* Is Logged in */}
            </button>
            ) : (
              <button className="header-btn" onClick={logIn}>
                Library {/* Is Logged OUT */}
              </button>
            )}
          {isLoggedIn ? (
            <button className="header-btn" onClick={logOut}>
              Log Out
            </button>
            ) : (
              <button className="header-btn" onClick={logIn}>
                Log In
              </button>
            )}
        </div>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          ×
        </button>
        <h2>Filter</h2>
        <h3>Player Number</h3>
        <div className="range_container">
          <div className="sliders_control">
            <input
              id="fromSlider"
              type="range"
              value={fromValue}
              min="1"
              max="8"
              step="1"
              aria-label="Minimum player number"
              onChange={(e) => setFromValue(Math.min(e.target.value, toValue - 1))}
            />
            <input
              id="toSlider"
              type="range"
              value={toValue}
              min="1"
              max="8"
              step="1"
              aria-label="Maximum player number"
              onChange={(e) => setToValue(Math.max(e.target.value, fromValue + 1))}
            />
          </div>
          <div className="form_control">
            <span>Min: {fromValue}</span>
            <span>Max: {toValue}</span>
          </div>
        </div>
      </div>

      {/* Main Content*/}
      <main>
        <h1>Dashboard Game Database</h1>
        {/* Container for the scrollable button grid */}
        <div className="button-grid">
          {[...Array(20)].map((_, index) => (
            <button key={index} className="grid-item">
              <img src={`https://via.placeholder.com/150`} alt={`Game ${index + 1}`} className="grid-item-img" />
              <span className="grid-item-text">Game {index + 1}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
    
   );
 };
  export default Front;