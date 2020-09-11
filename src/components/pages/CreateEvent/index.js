//get data from form, put it into a FormData instance, append properties, send with headers: {user_id}

import React, { useState, useMemo } from 'react'
import api from '../../../services/api'
import { Button, Form, FormGroup, Input, Container, Label, Alert, Col } from 'reactstrap';
import cameraIcon from "../../../assets/camera.png"
import './events.css'

export default function EventsPage({history}) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [thumbnail, setThumbnail] = useState(null)
    const [activity, setActivity] = useState("")
    const [date, setDate] = useState("")
    const [errorMessage, setErrorMessage] = useState(false)
    const [errorMember,setErrorMember] = useState(null)

    const handleSubmit = async e => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        
        if (!token) {
            setErrorMember("You haven't logged in yet")
        } else {
            const eventData = new FormData()
            eventData.append('thumbnail', thumbnail)
            eventData.append('title', title)
            eventData.append('description', description)
            eventData.append('activity', activity)
            eventData.append('date', date)
            eventData.append('price', price)
            try {
                if (thumbnail !== null && title !== "" && description !== "" &&
                    activity !== "" && date !== "" && price !== "") {
                    await api.post('/events/add', eventData, { headers: { token } })
                    //remember to wrap user_id with {} or else it wont work  
                    setTimeout(() => {
                        history.push('/')
                    }, 1000)
                    
                } else {
                    setErrorMessage(true)
                    setTimeout(() => {
                        setErrorMessage(false)
                    }, 2000)
                }
                
            } catch (error) {
                Promise.reject(error)
            }     
        }
    

        return ""
    }
    //when thumbnail change, return value
    //if there is a file, display its prev
    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null
    },[thumbnail])
    return (
        <Container> 
            <Button className="side-btn" onClick={()=>history.push('/')}>Back to dashboard</Button>
            <h3>In here you can create your own events!</h3>
            <Form onSubmit={handleSubmit}>
{/* TITLE */}
                <FormGroup row>
                    <Label for="title" sm={2}><h6>Title: </h6></Label>
                    <Col sm={10}>
                        <Input id="title" placeholder="Title of event (maximum number of letters: 25)"
                            value={title} maxLength="25"
                            onChange={e => setTitle(e.target.value)} />
                    </Col>
                </FormGroup>
{/* DATE */}
                <FormGroup row>
                    <Label for="date" sm={2}><h6>Date: </h6></Label>
                    <Col sm={10}>
                        <Input type="datetime-local" id="date" value={date}
                            onChange={e => setDate(e.target.value)} />
                    </Col>
                </FormGroup>
{/* ACTITVITY */}
                <FormGroup row>
                    <Label for="activity" sm={2}><h6>Activity: </h6></Label>
                    <Col sm={10}>
                        <Input id="activity" value={activity} maxLength="10"
                            placeholder="(Lower case) Main activity of event (maximum number of letters: 10) "                            
                            onChange={e => setActivity(e.target.value)} />
                    </Col>
                </FormGroup>
{/* upload image                */}
                <FormGroup>
                    <Label><h6>Upload image: </h6></Label>
                    <Label id="thumbnail" style={{ backgroundImage: `url(${preview})` }} className={thumbnail ? "has-thumbnail" : ""}>                         
                        <Input type="file"  onChange={e => setThumbnail(e.target.files[0])} />
                        <img src={cameraIcon} alt="icon" style={{ maxWidth: "50px" }} />                        
                    </Label>
                </FormGroup>
{/* DESCRIPTION */}
                <FormGroup row>
                    <Label for="description" sm={2}><h6>Description: </h6></Label>
                    <Col sm={10}>
                        <Input id="description" placeholder="Brief description about your event"
                            value={description} onChange={e => setDescription(e.target.value)} />
                    </Col>
                </FormGroup>
{/* PRICE */}
                <FormGroup row>
                    <Label for="price" sm={2}><h6>Price: </h6></Label>
                    <Col sm={10}>
                        <Input type="number" id="price" placeholder="VND" value={price}
                           onChange={e => setPrice(e.target.value)} />
                    </Col>
                </FormGroup>
                

                <Button className="submit-btn" type="submit">Create Event</Button>
            </Form>
            {errorMessage ? 
                (<Alert className="validation-err" color="warning">Please fill in all required parts</Alert>) :
                    ""
            }
            {errorMember ? 
                (
                    <Alert className="validation-err" color="warning">{errorMember}
                        <Button className="secondary-btn" onClick={() => history.push('/login')}>Login</Button>
                    </Alert>
                ) :
                    ""
            }
            
        </Container>
    )
}
