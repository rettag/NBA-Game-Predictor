import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Predictor from './Predictor';
import Home from './Home';

//import { Link } from 'react-router-dom';
//<Link to="/">Home</Link>
function App() {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predictor" element={<Predictor />} />
      </Routes>

    </Router>
    );
  }
  
  export default App;
  