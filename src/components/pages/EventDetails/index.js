import React, { useEffect, useState } from 'react'
import {
    Card, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle
  } from 'reactstrap';
import api from '../../../services/api';
import moment from 'moment'
import './eventDetails.css'
export default function EventDetails({history}) {
    const [event, setEvent] = useState({})

    // /details/event
    useEffect(() => {
        getEvent()
    }, [])
    
    const start = window.location.href.indexOf('/#')
    const path = window.location.href.slice(start+2)
    const getEvent = async () => {
        
        const result = await api.get(`${path}`)
        setEvent(result.data)
        
    }

    return (
        <>
            <Card>
                <CardBody>
                    <CardTitle><h5>{event.title}</h5></CardTitle>
                    <CardSubtitle>{typeof event.price !== 'undefined' ? event.price.toLocaleString() : ""} VND</CardSubtitle>
                    {moment(event.date).format('LLLL')}
                </CardBody>
                <img width="100%" src={event.thumbnail_url} alt={event.title} />
                <CardBody>
                <CardText>{event.description}</CardText>
                <CardLink onClick={()=>history.push('/my-subscriptions')}>Go back <i className="fa fa-history"></i></CardLink>
                </CardBody>
            </Card>
        </>
    )
}