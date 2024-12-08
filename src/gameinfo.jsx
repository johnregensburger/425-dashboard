//============== individual game information page in both database and library ================
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
const GameInfo = () => {
  const { id, loc } = useParams(); //passed in parameters. loc) true = database, false = library
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [game, setGame] = useState([]);
  const [userId, setuserId] = useState(null);
  const [location, setLocation] = useState();
  const [ownership, setOwnership] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/test-session', {
        method: 'GET',
        credentials: 'include', // include user id on request
      });

      if (response.ok) {
        const data = await response.json();
        const userId = data.userID; // Extract user ID from response
        setuserId(userId);          //sets user id on this page for add + delete functions
        setIsLoggedIn(true);        //tells the page youre logged in
      } else {
        const errorData = await response.json();
        console.error('No active session:', errorData);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
      alert('Error fetching user ID.');
    }
  };

  const checkOwnership = async () => {
    try {
      const response = await fetch(`http://localhost:3000/libraries/${userId}/owns/${id}`, {
        method: 'GET',
        credentials: 'include', // Include cookies/session
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Ownership status:', data.owned);
        setOwnership(data.owned);
      } else {
        console.error('Failed to fetch ownership status.');
      }
    } catch (error) {
      console.error('Error checking ownership:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const logOut = () => {
  setIsLoggedIn((prevState) => !prevState); //tells the page youre logged out
    navigate('/'); //nav to the Login page and expires session token(?)
  };

  const logIn = () => {
  navigate('/'); //nav to the Login page
  };

  const loginAlert = () => {
    alert('You are not logged in!');
  };

  const goToLibrary = () => {
  navigate('/library'); // nav to library
  };

  const goToFront = () => {
  navigate('/front'); //nav to database
  };

  const checkLoc = (where) => {  //called as soon as page loads, loc from parameters is passed in
  if(where === "true") //if true was passed in, they came from the database
    setLocation(true);        
  else
    setLocation(false); //theres no other option so they came from the library
  };

  const navLoc = () => { //called when user clicks the back button
  if(loc === "true")
    navigate('/front'); // navigate to database
  else
    navigate('/library') //navigate to library
  };

  const fetchGame = async () => {
  try {   //calls one specific game that was passed in parameters
    const response = await fetch(`http://localhost:3000/games/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch game');
    }
    const data = await response.json(); // Fetch the data
    setGame(data); //updates the state
  } catch (error) {
    console.error('Error fetching games:', error);
  }};

  const addToLibrary = async (status) => {
    try {
      const response = await fetch(`http://localhost:3000/libraries`, {
        method: 'POST', //posting to user's library
        headers: {
          'Content-Type': 'application/json', //verifies that its a json response
        },
        body: JSON.stringify({ 
          userId: userId,
          gameId: id,    //data passed into fetch
          status: status,
        }),
        credentials: 'include', //include userId
      });

      if (!response.ok) {
        alert('Either game already exists or another error has occured')
        console.log("Library error");
        return;
      }
      console.log("Library Success");
      alert(`Game added to your library`);  //lets the user know that it was successful
      checkOwnership();
    }catch(error) {
      console.error('Error:', error);
      alert(`Error: ${error.message || 'Unknown Error'}`);
  }};

  const removeFromLibrary = async (userId, gameId) => {
    try {
      console.log("Removing from user library...");
      const response = await fetch(`http://localhost:3000/libraries/${userId}/${gameId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        console.log("Library error");
        alert("An Error Occurred. Please try again.");
        return;
      }
      console.log("Library Success");
      alert(`Game removed from your library`);  //lets the user know that it was successful
      checkOwnership();
    } catch(error) {
      console.error('Error:', error);
      alert(`Error: ${error.message || 'Unknown Error'}`);
  }};

  useEffect(() => {   //runs as soon as the page opens.  order matters
    checkLoginStatus();
    checkLoc(loc);
    fetchGame();
  }, []);

  useEffect(() => {
    if (userId) {
      checkOwnership();
    }
  }, [userId]); // Dependency on userId

  const nicerParagraph = (desc) => { //removes weird shit that was parsed into the description probably by accident
    const entityMap = {
      "&quot;": '"',
      "&amp;": "&",
      "&mdash;": "—",
      "&egrave;": "è",
      "&ldquo;": "“",
      "&rdquo;": "”",
      "&#039;": "'"
    };

    let text = typeof desc === "string" ? desc : String(desc); //parses desc into a string

    if (typeof desc !== "string") {
      return ""; // Return an empty string if it's not a valid string
    }

    const replaceEntities = (str) => {
      return str
            .replace(/<br\/>/g, "\n") // Replace <br/> specifically since it is a tag
            .replace(/&[^;]+;/g, (entity) => entityMap[entity] || ""); // Replace HTML entities instead of removing them
    };
    
    //removes all of the phrases in the remove array from desc
    const filteredText = replaceEntities(text);
    return filteredText;
  };

  return ( 
    <div >
      {/* Header Section */}
      <header>
        <div className="header-left"> {/* checks location and naviagates you accordingly */}
          <button className="header-btn" onClick={navLoc}> Back </button>
        </div>
        <div className="header-right">
          {/* if location is true v */}
          {location ? (
            isLoggedIn ? (
              <button className="header-btn" onClick={goToLibrary}>
                Library {/* Is Logged in */}
              </button>
            ) : (
              <button className="header-btn" onClick={loginAlert}>
                Library {/* Is Logged OUT */}
              </button>
            )) : (
            isLoggedIn ? (
              <button className="header-btn" onClick={goToFront}>
                Database {/* Is Logged in */}
              </button>
            ) : (
              <button className="header-btn" onClick={goToFront}>
                Database {/* Is Logged OUT */}
              </button>
          ))}  {/* if location is false ^ */}
          {isLoggedIn ? (
            <button className="header-btn" onClick={logOut}>
              Log Out {/* is logged in */}
            </button>
          ) : (
            <button className="header-btn" onClick={logIn}>
              Log In  {/* is logged out */}
            </button>
          )}
        </div>
      </header>
      {/* Main Content*/}
      <main>
        <div className="info-container">

          {/* Left side */}
          <div className="left-info">
            <h1>{game.gameName} - {game.releaseDate}</h1>
            <h2>{game.publisher}, {game.leadDesigner}</h2>

            <div className="dual-container">
              <div className="image-container">
                  <img src={game.boxArtUrl} alt={game.gameName}/>
              </div>
              <div className="paragraph-handler">
                <p>{nicerParagraph(game.description)}</p>
              </div>
            </div>

            {/* Library Add/Delete logic */}
            {loading ? (
              <button className="filter" disabled>
                &nbsp;{/* Loading */}
              </button>
            ) : (
              // Check if logged in
              isLoggedIn ? (
                ownership ? (
                  <button className="filter" onClick={() => removeFromLibrary(userId, id)}>
                    Remove from my Library {/* Owned & Logged In */}
                  </button>
                ) : (
                  <button className="filter" onClick={() => addToLibrary("owned")}>
                    Add to my Library {/* Not Owned & Logged In */}
                  </button>
                )
              ) : (
                <button className="filter" onClick={loginAlert}>
                  Add to my Library {/* Logged Out */}
                </button>
              )
            )}

          </div>

          {/* Right side */}
          <div className="right-info">
            {/* everything but desc */}
            <div className="mini-container">
              <h2>Players: {game.minPlayers} - {game.maxPlayers}</h2>
              <h2>Age Suggestion: {game.age}+</h2>
              <h2>Avg. Playtime: {game.playTime} min</h2>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default GameInfo;