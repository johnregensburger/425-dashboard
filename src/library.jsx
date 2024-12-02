import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Library = () => {
    console.log('Login component rendered!');

 const navigate = useNavigate();
 
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 const [fromValue, setFromValue] = React.useState(1);
 const [toValue, setToValue] = React.useState(8);
 const [isLoggedIn, setIsLoggedIn] = useState(true); //TEST CHANGE LATER!!!!!!!!!!!!!!!!!!!!!!!!!!!

 const fromPercent = (fromValue / 100) * 100;
 const toPercent = (toValue / 100) * 100;

 const goToFront = () => { //navigate to front page  
        navigate('/front');
    }
  
  const goToInfo = () => {  //NEEDS TO BE ADJUSTED PER GAME
      navigate('/info');
  }

const logOut = () => {
    setIsLoggedIn((prevState) => !prevState);
        navigate('/'); // Navigate to the Login page
    };
    
    const logIn = () => {
    navigate('/'); // Navigate to the Login page
    }
    
    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };
    
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
        <button className="header-btn" onClick={goToFront}>
          Database
        </button>
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
    <main>
    <h1>User Library</h1>
        {/* Container for the scrollable button grid */}
        <div className="button-grid">
          {[...Array(20)].map((_, index) => (
            <button key={index} className="grid-item" onClick={goToInfo}>
              <img src={`https://via.placeholder.com/150`} alt={`Game ${index + 1}`} className="grid-item-img" />
              <span className="grid-item-text">Game {index + 1}</span>
            </button>
          ))}
        </div>
    </main>
  </div>
   );
 };
  export default Library;