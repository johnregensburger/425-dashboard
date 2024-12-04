//================== duplicate login page but for creating an account =======================
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
const LoginCreate = () => {
  const navigate = useNavigate();           // Sets the automatic form data to be blank
  const [formData, setFormData] = useState({ username: '', password: '', cpassword: '',});

  const handleChange = (event) => { // Handles change in text box
    const { name, value } = event.target;
      setFormData((prevData) => ({  
      ...prevData,
        [name]: value,
      }));
  };

  const handleCreate = async () => {
    const{username, password, cpassword} = formData;
  
    if(!username || !password || !cpassword) { //if not all fields are filled
      alert('All fields are required');
      setFormData({ username: '', password: '', cpassword: ''}); // Resets it back to blank
      return;
    };
  
    if(password !== cpassword){  //if passwords dont match
      alert('Passwords must match');
      setFormData({ username: '', password: '', cpassword: ''});
      return;
    };
  
    if (/\s/.test(password)){ // Password cannot have whitespace
      alert('Password cannot contain spaces');
      setFormData({ username: '', password: '', cpassword: ''});
      return;
    };

    try {
      console.log("Sending request to create user...");
      const response = await fetch('http://localhost:3000/users', { //calls endpoint to create a new user
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), //parameters
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
        <header className="content">      {/* navigate to database w/out logging in */}
          <button className="header" onClick={() => navigate('/front')}>DASHBOARD</button>
        </header>
        <div className="login-section">
          <h2>Create Your Account</h2>
          <input className="text" type="text" name="username" placeholder="username"
            value={formData.username || ''} onChange= {handleChange}/>
          <input className="text" type="password" name="password" placeholder="password"
            value={formData.password || ''} onChange= {handleChange}/>
          <input className="text" type="password" name="cpassword" placeholder="confirm password"
            value={formData.cpassword || ''} onChange= {handleChange}/>
          <button className="submit" onClick={handleCreate}> Create Account </button>
        </div>
      </div>
      <div className="right">
        <img src="/bookshelf_425.png" alt="Bookshelf" />
      </div>
    </div>
  );
};
export default LoginCreate;