import React, { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
const GameInfo = () => {
const { id, loc } = useParams();
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [game, setGame] = useState([]);
const [userId, setuserId] = useState(null);
const [location, setLocation] = useState();

 const navigate = useNavigate();

 const checkLoginStatus = async () => {
  try {
    const response = await fetch('http://localhost:3000/test-session', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
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
  }
};

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
    const response = await fetch(`http://localhost:3000/games/${userId}`);
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

const addToLibrary = async (status) => {
  try {
    console.log("Adding to user library...");
    console.log(userId, status, id);
    const response = await fetch(`http://localhost:3000/libraries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId: userId,
        gameId: id,
        status: status,
      }),
      credentials: 'include',
    });
    
    const data = await response.json();

    if (!response.ok) {
      console.log("Library error");
      return;
    }
    console.log("Library Success");
    alert(`Game added to your library`);

  } catch(error) {
    console.error('Error:', error);
    alert(`Error: ${error.message || 'Unknown Error'}`);
  }
}

const removeFromLibrary = async (userId) => {
  try {
    console.log("Removing from user library...");

    const response = await fetch(`http://localhost:3000/libraries/${userId}`, {
      method: 'DELETE',
    }); //fix parameter
    
    const data = await response.json();

    if (!response.ok) {
      console.log("Library error");
      alert("An Error Occurred. Please try again.");
      return;
    }

    console.log("Library Success");
    alert(`Game removed from your library`);

  } catch(error) {
    console.error('Error:', error);
    alert(`Error: ${error.message || 'Unknown Error'}`);
  }
}

useEffect(() => {
  fetchGame();
  checkLoc(loc);
  checkLoginStatus();
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
              {location ? (
                  isLoggedIn ? (
                    <button className="filter" onClick={() => addToLibrary("owned")}>
                      Add to my Library {/* Is Logged in */}
                    </button>
                  ) : (
                    <button className="filter" onClick={logIn}>
                      Add to my Library {/* Is Logged OUT */}
                    </button>
                  )) : (
                    <button className="filter" onClick={() => removeFromLibrary("owned")}>
                      Remove from my Library {/* Is Logged in */}
                    </button>
                )}
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