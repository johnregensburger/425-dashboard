import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Front = () => {

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [fromValue, setFromValue] = React.useState(1);
const [toValue, setToValue] = React.useState(8);
const [games, setGames] = useState([]);
const [visibleGames, setVisibleGames] = useState(20); // Start by showing 20 games


const toggleSidebar = () => {
  setIsSidebarOpen(prevState => !prevState);
};

 const navigate = useNavigate();

 const logOut = () => {
  setIsLoggedIn((prevState) => !prevState);
   navigate('/'); // Navigate to the Login page
 };

 const logIn = () => {
  navigate('/'); // Navigate to the Login page
 }

 const goToLibrary = () => {
  navigate('/library');
 }

 const goToInfo = (game) => {  //NEEDS TO BE ADJUSTED PER GAME
  navigate(`/info/${game}`);
}

const checkLoginStatus = () => {
  //check if user is logged in
}

const fetchGames = async () => {
  
  try {
    const response = await fetch(`http://localhost:3000/games/${1}`); //fix back to id
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }
    const data = await response.json(); // Fetch the data
    setGames(data); //update the state
  } catch (error) {
    console.error('Error fetching games:', error);
  }
};

const loadMoreGames = () => {
  setVisibleGames((prev) => Math.min(prev + 20, games.length));
};

useEffect(() => {
  fetchGames();
}, []);

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
      <div className="button-grid" onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          if (scrollTop + clientHeight >= scrollHeight - 10) {loadMoreGames();}}}>

        {games.slice(0, visibleGames).map((game) => (
          <button key={game.id} className="grid-item"
            onClick={() => goToInfo(game.id)}>
            <img src={game.img} alt={game.name} className="grid-item-img"/>
            <span className="grid-item-text">{game.name}</span>
          </button>
        ))}
      </div>
    </main>
    </div> 
    
   );
 };
  export default Front;