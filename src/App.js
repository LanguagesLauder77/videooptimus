import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Creative from './Creative';
import FileUpload from './FileUpload';
import HomePage from './HomePage';
import Bestsellar from './Bestsellar';
import Combine from './Combine';
import LoginPage from './LoginPage'; // import your login page component

function App() {
  return (
    <Router>
    <Routes>
          <Route path="/" element={<LoginPage  />} />
          <Route path="/HomePage" element={<HomePage  />} />
          <Route path="/FileUpload" element={<FileUpload />} />
          <Route path="/Creative" element={<Creative />} />
          <Route path="/Bestsellar" element={<Bestsellar />} />
          <Route path="/Combine" element={<Combine   />} />
        </Routes>
  </Router>
  );
}

export default App;
