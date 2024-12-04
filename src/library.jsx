import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Library = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [games, setGames] = useState([]);
  const [visibleGames, setVisibleGames] = useState(20);
  const [userId, setuserId] = useState(null);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/test-session', {
        method: 'GET',
        credentials: 'include', // Includes userid in request
      });

      if (response.ok) {
        const data = await response.json();
        const userId = data.userID; // Extract user ID from response
        setuserId(userId);
        setIsLoggedIn(true);
        console.log('User ID:', userId);
      } else {
        const errorData = await response.json();
        console.error('No active session:', errorData);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
      alert('Error fetching user ID.');
  }};

  const goToFront = () => { //navigate to front page  
    navigate('/front');
  };
    
  const goToInfo = (id, loc) => { //passes in game id and where you're coming from
    navigate(`/info/${id}/${loc.toString()}`); //go to page of game you clicked on
  };

  const logOut = () => {
    setIsLoggedIn((prevState) => !prevState); //tells the page youre logged out
    navigate('/'); // Navigate to the Login page and expires session token(?)
  };
    
  const logIn = () => {
    navigate('/'); // Navigate to the Login page
  };

  const fetchGames = async (id) => {
    try { //fetches games at specified user id's library
      const response = await fetch(`http://localhost:3000/ulibrary/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json(); // Fetch the data
      setGames(data); //updates the state
    } catch (error) {
      console.error('Error fetching games:', error);
  }};

  const loadMoreGames = () => { //loads more games into the scrollbox
    setVisibleGames((prev) => Math.min(prev + 20, games.length));
  };
      
  useEffect(() => { //this runs as soon as the page starts
    checkLoginStatus();
  }, []); 

  useEffect(() => { //this runs after the first use effect so that it's able to check login status first
      if (userId) { // Only fetch games if userId is not null
          fetchGames(userId);
      }
  }, [userId]);

  return ( 
    <div >
      {/* Header Section */}
      <header>
        <div className="header-left"></div> {/* only here to keep space */}
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
  
    <main>
    <h1>User Library</h1> 
        {/* Container for the scrollable button grid */}
        <div className="button-grid" 
      onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          if (scrollTop + clientHeight >= scrollHeight - 10) {loadMoreGames();}}}>

        {/* maps each game into its own button */}
        {games.length === 0 ? (<p>No games available.</p>) : (
            games.slice(0, visibleGames).map((game) => (
                <button
                    key={game.gameId}
                    className="grid-item"
                    onClick={() => goToInfo(game.gameId, false)}
                    aria-label={`View details for ${game.gameName}`}>
                    <img
                        src={game.boxArtUrl} // Ensure property matches your backend
                        alt={`${game.gameName}`}
                        className="grid-item-img"/>
                    <span className="grid-item-text">{game.gameName}</span>
                </button>
            ))
        )}
      </div>
    </main>
  </div>
  );
};
export default Library;