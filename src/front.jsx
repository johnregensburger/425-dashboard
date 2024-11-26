import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Front = () => {

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  // navigate('/library');
 }

 console.log('Front Page component rendered!');
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

      {/* Sidebar*/}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          ×
        </button>
        <h2>Sidebar</h2>
        <p>Some content here...</p>
      </div>

      {/* Main Content*/}
      <main>
        <h1>Welcome to the Webpage</h1>
        <p>Here you can see a header with buttons and a popup sidebar on the left.</p>
      </main>
    </div>
   );
 };
  export default Front;