import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';


export default function Routes() {
    return (
    <Router>
        <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/sign-up" exact component={Register} />                
            <Route path="/dashboard" exact component={Dashboard} />
            
        </Switch>
    </Router>

    )
}