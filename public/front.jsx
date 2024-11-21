import React from 'react';
import { useNavigate } from 'react-router-dom';
const Front = () => {

 const navigate = useNavigate();

 const logOut = () => {
   navigate('/'); // Navigate to the Login page
 };
 console.log('Front Page component rendered!');
   return ( 
    <div className="container">
    <h1> under const.</h1>
    </div>
   );
 };
  export default Front;