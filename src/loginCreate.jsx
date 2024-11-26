import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import bookshelf from './assets/bookshelf_425.png'
const LoginCreate = () => {

 const navigate = useNavigate();

 const [formData, setFormData] = useState({
    username: '',  //sets the automatic formdata to be blank
    password: '',   //so we can reset it easily
    cpassword: '',
 });

 const handleChange = (event) => { //handles change in text box
    const { name, value } = event.target;
     setFormData((prevData) => ({  
      ...prevData,
       [name]: value,
     }));
  };

 const goBack = () => {
    //TODO: INTEGRATE ADDING USER TO DATABASE HERE
   navigate('/'); // Navigate to the Login page
 };

 console.log('Login component rendered!');
   return ( 
    <div className="container">
    <div className="left">
    <header className="content">
      <h1>DASHBOARD</h1>
    </header>
    <div className="login-section">
      <h2>Create Your Account</h2>
        <input className="text"
        type="text"
        name="username"
        value={formData.username}
        onChange= {handleChange}
        placeholder="Username"
        />

        <input className="text"
        type="password"
        name="password"
        value={formData.password}
        onChange= {handleChange}
        placeholder="Password"
        />

        <input className="text"
        type="password"
        name="cpassword"
        value={formData.cpassword}
        onChange= {handleChange}
        placeholder="Confirm Password"
        />

        <button className="submit" onClick={goBack}>Create Account</button>
    </div>
    </div>
    <div className="right">
        <img src={bookshelf} alt="bookshelf"/>
    </div>
    </div>
   );
 };
  export default LoginCreate;