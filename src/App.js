import React from 'react';
import './App.css';
import { Container } from 'reactstrap'
import Routes from './routes';
import Navbar from './components/Navbar';
import { BrowserRouter as Router} from 'react-router-dom'
 import ScrollToTop from './components/ScrollToTop';


function App() {
  return (
    
    <Router>   
    <ScrollToTop/>
    <Navbar />   
    <Container >
      <div className="content">
          <Routes />
      </div>
      </Container> 
    </Router>
    
    
      
  );
}

export default App;
