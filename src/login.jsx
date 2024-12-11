//================================ landing page: login ==================================
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', }); //sets the automatic formdata to be blank
  const [message, setMessage] = useState(''); 

  const handleChange = (event) => {   //if a input box is changed, it dynamically updates
    const { name, value } = event.target;
      setFormData((prevData) => ({  
      ...prevData,
        [name]: value,
      }));
  };

  const goTologinCreate = () => {
    navigate('/loginCreate'); //Navigate to create user page
  };

  const validateLogin = async () => { 
    const user = formData.username;
    const pass = formData.password;

    if (!user || !pass) {
      setMessage('Username and password are required');
      return;
    };
    
    try {
      console.log("Sending request to validate user...");
      const response = await fetch(`http://localhost:3000/users/login`, {
        method: 'POST', //calls login endpoint which assigns a session token and validates that 
        headers: {      //the user exists and the pass is correct
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user, password: pass }), //parameters
        credentials: 'include' // includes userId in pass
      })

      if(!response.ok){
        const error = await response.json();
        setMessage(error.error || 'Invalid credentials');
        alert("Invalid credentials. Please try again."); //alerts user of invalid response
        setFormData({ username: '', password: '' }); //resets inputs
        return;
      }
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Login successful
        console.log("User validated:", data);  
        alert(`Welcome, ${data.username}!`); //alerts user that login was successful
        setFormData({ username: '', password: '' }); //resets inputs
        navigate('/front'); //navigates user to database logged in
      } else {
        const error = await response.json();
        console.error('Failed:', error);
        alert('An error has occurred.');
      }
    } catch(error) {
      console.error('Error:', error);
      alert("An error has occurred. Please try again.");
      setFormData({ username: '', password: '' }); // resets inputs
  }};

  return ( 
    <div className="container">
      <div className="left">
        <header className="content"> {/* make nice looking title card*/}
          <h1 className = "header">DASHBOARD</h1>
          <h3 className = "header">Digital Boardgame Tracker and Database</h3>
        </header>
        <div className="login-section">
          <h2>Login</h2>
          <input
            className="text" name="username" type="text" placeholder="Username"
            value={formData.username} onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && validateLogin(e)} // Enter to login
          />
          <input
            className="text" name="password" type="password" placeholder="Password"
            value={formData.password} onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && validateLogin(e)} // Enter to login
          />
          <button className="submit" onClick={validateLogin}> Submit </button>
          <h3>Or sign up</h3>
          <button className="submit" onClick={goTologinCreate}> Create an account </button>
          <button className="link" onClick={() => navigate('/front')}>Continue without logging in</button>
        </div>
      </div>
      <div className="right">
        <img src="/bookshelf_425.png" alt="Bookshelf" />
      </div>
    </div>
   );
};
export default Login;