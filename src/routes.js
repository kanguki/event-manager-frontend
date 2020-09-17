import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Register from './components/pages/Register';
import EventsPage from './components/pages/CreateEvent';
import ManageRequests from './components/pages/ManageRequests';
import MySubscription from './components/pages/MySubscription';
import EventDetails from './components/pages/EventDetails';
import EventRegistrations from './components/pages/EventRegistrations';
import Profile from './components/pages/Profile';
import ConfirmPage from './components/pages/ConfirmPage';



export default function Routes() {
    return (
    
    <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/login" exact component={Login} />
        <Route path="/sign-up" exact component={Register} />                
        <Route path="/events" component={EventsPage} />
        <Route path="/manage-requests" component={ManageRequests} />
        <Route path="/my-subscriptions" component={MySubscription} />
        <Route path="/details/event" component={EventDetails} />
        <Route path="/event/registrations" component={EventRegistrations} />
        <Route path="/confirm-email-success/" component={ConfirmPage} />
        <Route path="/profile" component={Profile}/>
    </Switch>
    
    )
}