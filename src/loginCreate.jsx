import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import bookshelf from './assets/bookshelf_425.png'
const LoginCreate = () => {

 const navigate = useNavigate();
 const [formData, setFormData] = useState({
    username: '',  // Sets the automatic form data to be blank
    password: '',   // So we can reset it easily
    cpassword: '',
 });

 const handleChange = (event) => { // Handles change in text box
    const { name, value } = event.target;
     setFormData((prevData) => ({  
      ...prevData,
       [name]: value,
     }));
  };

  const handleCreate = async () => {
    const{username, password, cpassword} = formData;
  
    if(!username || !password || !cpassword) {
    alert('All fields are required');
    setFormData({ username: '', password: '', cpassword: ''}); // Resets it back to blank
    return;
    }
  
    if(password !== cpassword)
    {
      alert('Passwords must match');
      setFormData({ username: '', password: '', cpassword: ''});
     return;
    }
  
    if (/\s/.test(password))
    { // Password cannot have whitespace
       alert('Password cannot contain spaces');
       setFormData({ username: '', password: '', cpassword: ''});
       return;
    }

    try {
      console.log("Sending request to create user...");
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
    
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert('Account created. Please log in.');
      navigate('/'); // Navigate to the Login page
      
    } catch(error) {
      console.error('user creation error:', error);

      if (error.response) {
        // Error returned from the server
        console.error("Server responded with an error:", error.response.data);
        alert(`Error from server: ${error.response.data}`);
    } else {
        // Network or other error
        console.error("Network error or other</header> error:", error.message);
        alert(`Error: ${error.message || 'Unknown error'}`);
    }}};

   return ( 
    <div className="container">
    <div className="left">
      <header className="content">
        <button className="header" onClick={() => navigate('/front')}>DASHBOARD</button>
      </header>
    <div className="login-section">
      <h2>Create Your Account</h2>
        <input className="text"
        type="text"
        name="username"
        value={formData.username || ''}
        onChange= {handleChange}
        placeholder="Username"
        />

        <input className="text"
        type="password"
        name="password"
        value={formData.password || ''}
        onChange= {handleChange}
        placeholder="Password"
        />

        <input className="text"
        type="password"
        name="cpassword"
        value={formData.cpassword || ''}
        onChange= {handleChange}
        placeholder="Confirm Password"
        />

      <button className="submit" onClick={handleCreate}> Create Account </button>
    </div>
    </div>
    <div className="right">
        <img src={bookshelf} alt="bookshelf"/>
    </div>
    </div>
   );
 };
  export default LoginCreate;