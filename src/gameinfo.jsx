//============== individual game information page in both database and library ================
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
const GameInfo = () => {
  const { id, loc } = useParams(); //passed in parameters. loc) true = database, false = library
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [game, setGame] = useState([]);
  const [userId, setuserId] = useState(null);
  const [location, setLocation] = useState();
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
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
      alert('Error fetching user ID.');
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
    } catch(error) {
      console.error('Error:', error);
      alert(`Error: ${error.message || 'Unknown Error'}`);
  }};

  useEffect(() => {   //runs as soon as the page opens.  order matters
    checkLoginStatus();
    checkLoc(loc);
    fetchGame();
  }, [userId]);

  const nicerParagraph = (desc) => { //removes weird shit that was parsed into the description probably by accident
    const remove = ["<br/>", "&quot;", "&amp;", "&mdash;","&egrave;","&ldquo;","&rdquo;"];
    
    let text = typeof desc === "string" ? desc : String(desc); //parses desc into a string

    if (typeof desc !== "string") {
      return ""; // Return an empty string if it's not a valid string
    }
    
    //removes all of the phrases in the remove array from desc
    const filteredText = remove.reduce((result, phrase) => result.replaceAll(phrase, " "), text);
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
            <div className="image-container">
                <img src={game.boxArtUrl} alt={game.gameName}/>
            </div>
          </div>
          {/* Right side */}
          <div className="right-info">
            {/* everything but desc */}
            <div className="mini-container">
              {/* if location is true v */}
              {location ? (
                isLoggedIn ? (
                  <button className="filter" onClick={() => addToLibrary("owned")}>
                    Add to my Library {/* Is Logged in */}
                  </button>
                ) : (
                  <button className="filter" onClick={loginAlert}>
                    Add to my Library {/* Is Logged OUT */}
                  </button>
                )) : (
                  <button className="filter" onClick={() => removeFromLibrary(userId, id)}>
                    Remove from my Library {/* Is Logged in */}
                  </button>)}  
              {/* if location is false ^ */}
              <h2>Players: {game.minPlayers} - {game.maxPlayers}</h2>
              <h2>Age Suggestion: {game.age}+</h2>
              <h2>Avg. Playtime: {game.playTime} min</h2>
            </div>
            {/* desc */}
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