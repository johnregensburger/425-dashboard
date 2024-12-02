import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const GameInfo = () => {

const [isLoggedIn, setIsLoggedIn] = useState(true); //TEST CHANGE LATER!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
    navigate('/front');     //navigate to front
 }

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
        <h1>Title of Game here</h1>
        {/* HAVE ALL GAME INFO HERE CALLED INDIVIDUALLY 
            INCLUDE ADD TO LIBRARY BUTTON THAT WILL ADD THE GAME TO THE DATABASE FOR THE USER'S LIBRARY
            */}
      </main>
    </div>
    
   );
 };
  export default GameInfo;