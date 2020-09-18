import React from 'react';
import './App.css';
import { Container } from 'reactstrap'
import Routes from './routes';
import Navbar from './components/Navbar';
import { BrowserRouter as Router} from 'react-router-dom'
 import ScrollToTop from './components/ScrollToTop';
 import { HashRouter } from 'react-router-dom'

function App() {
  return (
    
    <HashRouter>   
    <ScrollToTop/>
    <Navbar />   
    <Container >
      <div className="content">
          <Routes />
      </div>
      </Container> 
    </HashRouter>
    
    
      
  );
}

export default App;
