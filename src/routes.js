import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Register from './components/pages/Register';
import EventsPage from './components/pages/CreateEvent';



export default function Routes() {
    return (
    
    <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/login" exact component={Login} />
        <Route path="/sign-up" exact component={Register} />                
        <Route path="/events" component={EventsPage} />
    </Switch>
    

    )
}