import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import bookshelf from './assets/bookshelf_425.png'
const Login = () => {
    console.log('Login component rendered!');

 const navigate = useNavigate();
 const username ='user'; //TEMP
 const password = 'pass'; //TEMP

  const [formData, setFormData] = useState({
     username: '',  //sets the automatic formdata to be blank
    password: '',   //so we can reset it easily
  });

   const handleChange = (event) => { //handles change in text box
    const { name, value } = event.target;
     setFormData((prevData) => ({  
      ...prevData,
       [name]: value,
     }));
  };

 const goToFront = () => { //navigate to front page  
    if(formData.username == username && formData.password == password) //REPLACE WITH USERCRUD THING
        navigate('/front'); // Navigate to the Login page

    else {
        setFormData({ username: '', password: '' }); //resets it back to blank
        alert("Invalid Login");
    }
 };

 const goTologinCreate = () => {
    navigate('/loginCreate'); //Navigate to create user page
 };

   return ( 
    <div className="container">
    <div className="left">
        <h1>DASHBOARD</h1>
        <h2>Login</h2>
        <button className="link" onClick={goTologinCreate}>Create Account</button>

        <input className="text"
        name="username"
        type="text" 
        value={formData.username} //refer to get,set array
        onChange= {handleChange}
        placeholder="Username"
        />

        <input className="text"
        name="password"
        type="password"
        value={formData.password} //refer to get,set array
        onChange= {handleChange}
        placeholder="Password"
        />

        <button className="submit" onClick={goToFront}>Submit</button>
    </div>
    <div className="right">
        <img src={bookshelf} alt="bookshelf"/>
    </div>
    </div>
   );
 };
  export default Login;