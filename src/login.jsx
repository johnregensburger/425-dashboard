import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import bookshelf from './assets/bookshelf_425.png'
const Login = () => {

 const navigate = useNavigate();

  const [formData, setFormData] = useState({
     username: '',  //sets the automatic formdata to be blank
     password: '',   //so we can reset it easily
  });

  const [message, setMessage] = useState(''); 


   const handleChange = (event) => { //handles change in text box
    const { name, value } = event.target;
     setFormData((prevData) => ({  
      ...prevData,
       [name]: value,
     }));
  };

  const bypassLogin = () => {
    navigate('/front');     //navigate to front logged out
 }

 const goTologinCreate = () => {
    navigate('/loginCreate'); //Navigate to create user page
 };

 const validateLogin = async (e) => { 
    e.preventDefault();

    const user = formData.username;
    const pass = formData.password;

    if (!user || !pass) {
      setMessage('Username and password are required');
      return;
    }
    
    try {
      console.log("Sending request to validate user...");


      const response = await fetch(`http://localhost:3000/users/verify-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user, password: pass }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Invalid username or password'); // Error
        return;
      }

      setMessage(data.message); // Login successful
      console.log("User validated:", data);

      alert(`Welcome, ${data.username}!`);
      navigate('/front');     

    } catch(error) {
      console.error('Error:', error);
      alert(`Error: ${error.message || 'Unknown Error'}`);
    }
 };

   return ( 
    <div className="container">
  <div className="left">
    <header className="content">
      <button className="header" onClick={bypassLogin}>DASHBOARD</button>
    </header>
    <div className="login-section">
      <h2>Login</h2>
      <button className="link" onClick={goTologinCreate}>
        Create Account
      </button>
      <input
        className="text"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        className="text"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button className="submit" onClick={validateLogin}>
        Submit
      </button>
    </div>
  </div>
  <div className="right">
    <img src={bookshelf} alt="bookshelf" />
  </div>
</div>
   );
 };
  export default Login;