import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const GameInfo = () => {
const { id } = useParams();
const [isLoggedIn, setIsLoggedIn] = useState(false);

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

 const response = fetch(`http://localhost:3000/games/${id}`, {
    method: 'GET',
 });  //finish here

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
        <h1>${game.name} ${game.releaseDate}</h1>
        <h2>${game.publisher}, ${game.leadDesigner}</h2>
        <img src={game.boxArtURL} alt={game.name}/>
        <p>${game.description}</p>
        <p>Players: ${game.minPlayers} - ${game.maxPlayers}</p>
        <p>Age Suggestion: ${game.age}</p>
        <p>Avg. Playtime: ${game.playTime}</p>
      </main>
    </div>
    
   );
 };
  export default GameInfo;