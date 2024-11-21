import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/styles.css'
import Login from './login.jsx'
import Front from './front.jsx'
import Create from './loginCreate.jsx'
console.log('Rendering main.jsx');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
     <Routes>
       <Route path="/" element={<Login />} /> {/* Login page */}
       <Route path='/front' element={<Front />}/> {/* Front page */}
       <Route path='/loginCreate' element={<Create />}/> {/* Create a new user page */}
     </Routes>
   </Router>
  </React.StrictMode>,
)