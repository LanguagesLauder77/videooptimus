import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Link } from 'react-router-dom';
import settingsImage from './settings.png';
import creativeImage from './idea.png';
import genAIImage from './artificial.png';

function HomePage() {
    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Loewy</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
        
          </ul>
        </div>
      </nav>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <img className="card-img-top" src={settingsImage} alt="Card image cap" />
              <div className="card-body">
                <h5 className="card-title">Operations</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <Link to="/FileUpload">
                <a href="#" className="btn btn-dark">Click</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img className="card-img-top" src={creativeImage} alt="Card image cap" />
              <div className="card-body">
                <h5 className="card-title">Creatives</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <Link to="/creative">
                <a href="#" className="btn btn-dark">Click</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img className="card-img-top" src={genAIImage} alt="Card image cap" />
              <div className="card-body">
                <h5 className="card-title">Links</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-dark">Click</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
  
  export default HomePage;