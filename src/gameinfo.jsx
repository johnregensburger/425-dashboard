import React, { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
const GameInfo = () => {
const { id } = useParams();
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [game, setGame] = useState([]);

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

 const goToFront = () => {
    navigate('/front'); // navigate to front
 }

 const fetchGame = async () => {
  try {
    const response = await fetch(`http://localhost:3000/games/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch game');
    }
    console.log('game fetched');
    const data = await response.json(); // Fetch the data
    setGame(data); //updates the state
  } catch (error) {
    console.error('Error fetching games:', error);
  }
};

useEffect(() => {
  fetchGame();
}, [id]);

   return ( 
     <div >
      {/* Header Section */}
      <header>
        <div className="header-left">
          <button className="header-btn" onClick={goToFront}>
            Back
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

      {/* Main Content*/}
      <main>
        <h1>{game.gameName} {game.releaseDate}</h1>
        <h2>{game.publisher}, {game.leadDesigner}</h2>
        <div className="image_container">
            <img src={game.boxArtUrl} alt={game.gameName}/>
        </div>
        <p>{game.description}</p>
        <p>Players: {game.minPlayers} - {game.maxPlayers}</p>
        <p>Age Suggestion: {game.age}</p>
        <p>Avg. Playtime: {game.playTime}</p>
      </main>
    </div>
    
   );
 };
  export default GameInfo;