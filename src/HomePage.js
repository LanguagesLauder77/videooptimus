import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Link } from 'react-router-dom';
import settingsImage from './settings.png';
import creativeImage from './idea.png';
import genAIImage from './artificial.png';
import loginImage from './logo4.png'; 

function HomePage() {
    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-custom">
    <a className="navbar-brand" href="#">
    <img src={loginImage} alt="Logo" width="50" height="50" className="d-inline-block align-top" />
      </a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
            <li className="nav-item active">
                <a className="nav-link" href="./HomePage">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item active">
                <a className="nav-link" href="./FileUpload">Operations</a>
            </li>
            <li className="nav-item active">
                <a className="nav-link" href="./Combine">Creative</a>
            </li>
        </ul>
    </div>
</nav>
<div className="container-fluid">
      {/* ... existing navbar ... */}
      <div className="center-screen">
        <div>
          <h2>Welcome to the Application Portal</h2>
        </div>
      </div>
    </div>
      </div>
    );
  }
  
  export default HomePage;