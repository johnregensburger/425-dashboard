import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css'
import Login from './login.jsx'
import Front from './front.jsx'
import Create from './loginCreate.jsx'
import Library from './library.jsx'
import GameInfo from './gameinfo.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
     <Routes>
       <Route path="/" element={<Login />} /> {/* Login page */}
       <Route path='/front' element={<Front />}/> {/* Front page */}
       <Route path='/loginCreate' element={<Create />}/> {/* Create a new user page */}
       <Route path='/library' element={<Library />}/> {/*User Library*/}
       <Route path='/info' element={<GameInfo />}/> {/*Individual Game information*/}
     </Routes>
   </Router>
  </React.StrictMode>,
)