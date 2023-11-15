import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Link } from 'react-router-dom';
import settingsImage from './settings.png';
import creativeImage from './idea.png';
import genAIImage from './artificial.png';
import loginImage from './logo4.png'; 
import { NavLink } from 'react-router-dom';
function HomePage() {
    return (
      <div className="container">
    <nav className="navbar navbar-expand-lg navbar-custom">
    <a className="navbar-brand" href="#">
        <img src={loginImage} alt="Logo" width="80" height="80" className="d-inline-block align-top" />
    </a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
            <li className="nav-item" style={{padding: "10px"}}>
                <NavLink exact to="/HomePage" className="nav-link" activeClassName="active-link">Home</NavLink>
            </li>
            <li className="nav-item" style={{padding: "10px"}}>
                <NavLink to="/FileUpload" className="nav-link" activeClassName="active-link">Operations</NavLink>
            </li>
            <li className="nav-item" style={{padding: "10px"}}>
                <NavLink to="/Combine" className="nav-link" activeClassName="active-link">Creative</NavLink>
            </li>
        </ul>
    </div>
</nav>
<div className="container-fluid">
      {/* ... existing navbar ... */}
      <div className="center-screen">
        <div>
          <h2 className="custom-h2-color">Welcome to the Application Portal</h2>
        </div>
      </div>
    </div>
      </div>
    );
  }
  
  export default HomePage;