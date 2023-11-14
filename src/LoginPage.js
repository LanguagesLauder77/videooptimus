import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import loginImage from './logo.png'; 

function LoginPage() {
  // State to hold the input from the user
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // Hardcoded username and password
  const correctUsername = 'loewycore';
  const correctPassword = 'Ph0t0DEL19';

  // For navigation
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check the username and password
    if (username === correctUsername && password === correctPassword) {
      localStorage.setItem('username', username); // "Authenticate" the user
      navigate('/homePage'); // Redirect to the home page
    } else {
      // If the username or password is wrong, set an error state
      setError(true);
    }
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row>
        <Col>
          <Form onSubmit={handleSubmit} className="text-center">
          <img src={loginImage} alt="login" className="mb-4" style={{ width: '100px', height: '100px' }} /> {/* Adjust size as needed */}
            <h3 className="mb-4 login-text">Login</h3>
            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
    type="text"
    placeholder="Enter username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="form-control"
/>
<Form.Control
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="form-control"
/>
            </Form.Group>
            {error && <p style={{ color: 'red' }}>Invalid username or password!</p>}
            <Button className="custom-button-color"  type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;