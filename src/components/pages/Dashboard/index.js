import React, { useState, useEffect } from 'react'
import {
     CardImg, CardText, CardBody,
     Button, CardHeader, CardFooter,ButtonGroup, Alert
} from 'reactstrap';

import moment from 'moment'
import api from '../../../services/api'
import './dashboard.css'
import socketio from 'socket.io-client'

export default function Dashboard({history}) {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token')
    const [events, setEvents] = useState([])
    const [rSelected, setRSelected] = useState(null)
    const [mes, setMessage] = useState(null)

//by default, it will render whenever there is any part in the component changes
//useEffect runs when component did mount or component did update
    useEffect(() => {
        getEvents()
    }, [])
    

    useEffect(() => {
        const socket = socketio('http://localhost:8000', { query: { user:user_id } })
        socket.on('registration_request', dataReceived => {
            console.log(dataReceived)
        })
    },[])

    const getEvents = async (activity) => {
            const url = activity ? `/dashboard/${activity}` : `/dashboard`
            const response = await api.get(url)
            setEvents(response.data)
        }
    const filterHandler = (prop) => {
        setRSelected(prop)        
        getEvents(prop)
    }
    const myEventsHandler = async () => {
        setRSelected("myEvents") 

        try {           
            if (token && user_id) {      
                const response = await api.get('/events/yourEvents', { headers: { token } })
                setEvents(response.data.event)
            } else {
                setMessage("You havent signed in yet")
                setTimeout(() => {
                    setMessage(null)
                }, 2000);
            }
        } catch (err) {
            Promise.reject(err)
        }        
    }
    const deleteHandler = async (event_id) => {
        let confirmDelete = window.confirm("Are you sure?");
        if (confirmDelete === true) {
            await api.delete(`/events/remove/${event_id}`,{headers:{token}})
            window.location.reload()
        } else {
            return 
        }       
    }

    const joinHandler = async (event) => {
        try {         
            let confirmDelete = window.confirm("Are you sure?");
            if (confirmDelete === true) {
                await api.post(`/registration/register/${event._id}`, {}, { headers: { token } })
                setMessage(`Successfully registered for ${event.title}. Wait for owner's approvement!`)
                setTimeout(() => {
                    setMessage(null)
                },3000)
            } else {
                return 
            }  
            
        } catch (error) {
            setMessage(`The registration has not been made...`)
            setTimeout(() => {
                setMessage(null)
            },1000)
        }
    }

    const updateHandler = async (event_id) => {
        return
    }

    const eventsNoRepeat = []

    return (
        <>
            <ButtonGroup>
                <Button key="" onClick={() => filterHandler(null)} active={rSelected === null}>
                    All events
                </Button>
            </ButtonGroup>
            <div className="separate">
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
            {/* Lead to createing-event page             */}
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
                    events.map(event => (                   
                        <li key={event._id}>
                            <CardHeader><span id="long-title">{event.title}</span>
                                <Button className="sub-btn" onClick={() => joinHandler(event)}>Join</Button></CardHeader>
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
                                    <Button className="sub-btn modi upd" onClick={()=>updateHandler(event._id)}>Update</Button>
                                </>) 
                                : ""}
                            </CardFooter>
                        </li>                  
                    ))
                }
            </ul>
            {
                events.length === 0 ? (<Alert color="warning">You haven't created any events yet</Alert>) : ""

            }
        </>
    )
}
