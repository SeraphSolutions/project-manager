import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Landing from './Landing'

function App() {
  return (

    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/" component={Landing} />
      </Switch>
    </Router>
    
  );
}

export default App;
