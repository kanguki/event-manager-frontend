import React, { useState, useEffect, useMemo } from 'react'
import {
     CardImg, CardText, CardBody,
     Button, CardHeader, CardFooter, Alert, Popover, PopoverBody
} from 'reactstrap';

import moment from 'moment'
import api from '../../../services/api'
import './dashboard.css'
import socketio from 'socket.io-client'

export default function Dashboard({history}) {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token')
    const [events, setEvents] = useState([])
    const [eventsDisplay, setEventsDisplay] = useState([])
    const [rSelected, setRSelected] = useState(null)
    const [mes, setMessage] = useState(null)
    const [joinedMes, setJoinedMes] = useState(null)
    const [eventsRequest, setEventsRequest] = useState([])
    const [showFilterOptions, setShowFilterOptions] = useState(false)
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [joinRequestHandle, setJoinRequestHandle] = useState(null)

    //this socket only changes when user_id in the local storage changes
    const socket = useMemo(() =>
        socketio('http://localhost:8000', { query: { user: user_id } })
        ,[user_id])

//useEffect runs when component in [] did mount or component in [] did update
    //so when passing in an empty array, usestate will run once, as it will never update
    useEffect(() => {
        getEvents()
    }, [])


    useEffect(() => {                
        socket.on('registration_request', dataReceived => {
            setEventsRequest([...eventsRequest, dataReceived])
        })
    },[eventsRequest, socket])
 
    const getEvents = async () => {
            const response = await api.get('/dashboard')
            setEvents(response.data)
            setEventsDisplay(response.data)
    }

    const filterHandler = async (activity) => {
        setRSelected(activity)       
        const url = activity ?  `/dashboard/${activity}` : `/dashboard`
        const response = await api.get(url)
        setEventsDisplay(response.data)
    }
    const myEventsHandler = async () => {
        setRSelected("myEvents")       
            if (token && user_id) {      
                const response = await api.get('/events/yourEvents', { headers: { token } })
                setEventsDisplay(response.data.event)
            } else {
                setMessage("You havent signed in yet")
                setTimeout(() => {
                    setMessage(null)
                }, 2000);
            }     
    }
    const deleteHandler = async (event_id) => {
        let confirmDelete = window.confirm("Are you sure?");
        if (confirmDelete === true) {
            await api.delete(`/events/remove/${event_id}`,{headers:{token}})
            getEvents()
        } else {
            return 
        }       
    }
    const joinHandler = async (event) => {
            setRSelected(event._id)
            if (token) {        
                const checkJoin = await api.get(`/registration/check/${event._id}`, { headers: { token } })
                if (checkJoin.data.status === true) {
                    setJoinedMes("You already subscribed to this event") 
                    setTimeout(() => {
                        setJoinedMes(null)
                    }, 1000)
                    return
                }             
            } else {
                setJoinedMes("You haven't logged in yet")
                setTimeout(() => {
                    setJoinedMes(null)
                }, 1000)
                return
            } 

            let confirmJoin = window.confirm("Are you sure?");
            if (confirmJoin === true) {
                await api.post(`/registration/register/${event._id}`, {}, { headers: { token } })
                setJoinedMes("Successfully sent request!")
                setTimeout(() => {
                setJoinedMes(null)
                }, 1000)
            } else {
                return 
            }  

    }
    const acceptRequestHandler = async (request,person,event) => {
        await api.post(`/registration/${request._id}/approve`)
        setJoinRequestHandle(`Accept ${person} to join ${event}!`)
        setTimeout(() => {
            setJoinRequestHandle(null)
            setEventsRequest(eventsRequest.slice(1,eventsRequest.length))
        }, 500);
    }
    const rejectRequestHandler = async (request,person,event) => {
        await api.delete(`/registration/remove/${request._id}`,{headers: {token}})     
        setJoinRequestHandle(`Block ${person}'s request to join ${event}!`)
        setTimeout(() => {
            setJoinRequestHandle(null)
            setEventsRequest(eventsRequest.slice(1,eventsRequest.length))
        }, 500);
    }

    const toggle = () => setPopoverOpen(!popoverOpen);
    const eventsNoRepeat = []
    return (
        <>
            <ul className="notifications">
                {eventsRequest.map(request =>                 
                    joinRequestHandle ?
                        (<Alert className="noti" key={request._id}
                            color={joinRequestHandle.includes('Accept') ? "info" : "danger"}>
                            {joinRequestHandle}</Alert>) :                    
                        (<li key={request._id}>
                            <p>
                                <strong>{request.user_id.email}</strong> 
                                requested to join 
                                <strong>{request.event_id.title}</strong>
                                <Button color="info"
                                    onClick={() =>
                                        acceptRequestHandler(request, request.user_id.email, request.event_id.title)}>
                                    Accept</Button>
                                <Button color="danger"
                                    onClick={() =>
                                        rejectRequestHandler(request, request.user_id.email, request.event_id.title)}>
                                    Reject</Button>
                            </p>
                        </li>)                   
                )}
            </ul>
            <Button id="Popover1" className="side-stick" outline color="primary"
                onClick={() => setShowFilterOptions(!showFilterOptions)}>
                {!showFilterOptions ?
                <i className="fa fa-search-plus"></i> :
                <i className="fa fa-search-minus"></i>}
            </Button>
            <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                <PopoverBody>        
                    <div className={showFilterOptions ? "filter-btn" : "filter-btn hide"}>
                        <Button className="all-events" key="" onClick={() => filterHandler(null)} active={rSelected === null}>
                            All events
                        </Button>            
                        {
                            events.map(event => {

                                const act = `${event.activity}`                        
                                if (!eventsNoRepeat.includes(act)) {      
                                    eventsNoRepeat.push(act) 
                                    
                                    return (                                                                                                         
                                            <Button key={event._id} onClick={() => filterHandler(act)}
                                                active={rSelected === act}>
                                                {act}
                                            </Button>                                    
                                        )
                                }
                                return ""
                            }) 
                        }

                    </div>
                </PopoverBody>
            </Popover>
            <div className="side-btn">
                <Button className="side-btn" onClick={myEventsHandler} active={rSelected === "myEvents"}>
                    My Events
                </Button>
            </div>
            {
                mes ? (<Alert color="warning">{mes}</Alert>) : ""
            }

            <ul className="events-list">
                {                  
                    eventsDisplay.map(event => (                   
                        <li key={event._id}>
                            {
                                joinedMes && rSelected === event._id ?
                                (<Alert className={joinedMes === "Successfully sent request!" ? "side-alert green" : "side-alert"}>
                                {joinedMes}
                                </Alert>) : ""
                            }   
                            <CardHeader>
                            <span id="long-title"> {event.title} </span>
                            {event.user_id !== user_id ? (                                
                                    <Button className="join sub-btn"
                                    onClick={() => joinHandler(event)} >
                                    Join
                            </Button>
                            ) : ""}    
                                
                            </CardHeader>
                            <CardBody>
                                <CardImg src={event.thumbnail_url} />
                                <CardText><strong>#{event.activity}</strong></CardText>
                                <CardText>{moment(event.date).format('LLLL')}</CardText>
                                <span className="description">{event.description}</span>
                            </CardBody>                       
                            <CardFooter>{event.price.toLocaleString()} VND   
                            {event.user_id === user_id ?
                                (<>
                                    <Button className="sub-btn modi del" onClick={()=>deleteHandler(event._id)}>Delete</Button>
                                </>) 
                            : ""}

                            </CardFooter>
                        </li>                  
                    ))
                }
            </ul>
            {
                eventsDisplay.length === 0 && rSelected==="myEvents" ? 
                (<Alert color="warning">You haven't created any events yet</Alert>) :
                ""
            }
        </>
    )
}
