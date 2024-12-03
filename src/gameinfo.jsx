import React, { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
const GameInfo = () => {
const { id, loc } = useParams();
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [game, setGame] = useState([]);
const [location, setLocation] = useState();

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
  navigate('/front');
 }

 const checkLoc = (where) => {  
  console.log(where);
  if(where === "true")
    setLocation(true);
  else
    setLocation(false);
  console.log(location);
 }

 const navLoc = () => {
  if(loc === "true")
    navigate('/front'); // navigate to front
  else
    navigate('/library') //navigate to library
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
  checkLoc(loc);
}, [id, loc]);


const nicerParagraph = (desc) => {
  const remove = ["<br/>", "&quot;", "&amp;", "&mdash;","&egrave;","&ldquo;","&rdquo;"];
  
  let text = typeof desc === "string" ? desc : String(desc);

  if (typeof desc !== "string") {
    return ""; // Return an empty string if it's not a valid string
  }
  
  // Filter out phrases
  const filteredText = remove.reduce(
    (result, phrase) => result.replaceAll(phrase, " "), 
    text
  );

  return filteredText;
};

   return ( 
     <div >
      {/* Header Section */}
      <header>
        <div className="header-left">
          <button className="header-btn" onClick={navLoc}>
            Back
          </button>
        </div>
        <div className="header-right">
        {location ? (
          isLoggedIn ? (
            <button className="header-btn" onClick={goToLibrary}>
              Library {/* Is Logged in */}
            </button>
          ) : (
            <button className="header-btn" onClick={logIn}>
              Library {/* Is Logged OUT */}
            </button>
          )
        ) : (
          isLoggedIn ? (
            <button className="header-btn" onClick={goToFront}>
              Database {/* Is Logged in */}
            </button>
          ) : (
            <button className="header-btn" onClick={goToFront}>
              Database {/* Is Logged OUT */}
            </button>
          )
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
        <div className="info-container">
          <div className="left-info">
            <h1>{game.gameName} {game.releaseDate}</h1>
            <h2>{game.publisher}, {game.leadDesigner}</h2>
            <div className="image-container">
                <img src={game.boxArtUrl} alt={game.gameName}/>
            </div>
          </div>
          <div className="right-info">
            <div className="mini-container">
              <h2>Players: {game.minPlayers} - {game.maxPlayers}</h2>
              <h2>Age Suggestion: {game.age}+</h2>
              <h2>Avg. Playtime: {game.playTime} min</h2>
            </div>
            <div className="paragraph-handler">
              <p>{nicerParagraph(game.description)}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
    
   );
 };
  export default GameInfo;