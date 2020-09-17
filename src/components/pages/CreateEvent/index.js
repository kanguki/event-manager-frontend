//get data from form, put it into a FormData instance, append properties, send with headers: {user_id}

import React, { useState } from 'react'
import api from '../../../services/api'
import { Button, Form, FormGroup, Input, Container, Label, Alert, Col } from 'reactstrap';
import './events.css'
// import cameraIcon from "../../../assets/camera.png"

export default function EventsPage({history}) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [thumbnail, setThumbnail] = useState("")
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
            const eventToSent = {thumbnail, title, description, activity,date, price}
            try {
                if (thumbnail !== "" && title !== "" && description !== "" &&
                activity !== "" && date !== "" && price !== "") {
                    await api.post('/events/add', eventToSent, { headers: { token } })
                    //remember to wrap token with {} or else it wont work  
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
    // const preview = useMemo(() => {
    //     return thumbnail ? URL.createObjectURL(thumbnail) : null
    // },[thumbnail])
    return (
        <Container> 
            <Button className="side-btn" onClick={()=>history.push('/')}>Back to dashboard</Button>
            <Form onSubmit={handleSubmit}>
{/* TITLE */}
                <FormGroup row>
                    <Label for="title" sm={2}><h6>Title: </h6></Label>
                    <Col sm={10}>
                        <Input id="title" placeholder="Keep it brief"
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
                            placeholder="(lowercase) number of letters<=10 "                            
                            onChange={e => setActivity(e.target.value)} />
                    </Col>
                </FormGroup>
{/* upload image                */}
                <FormGroup row>
                    <Label for="thumbnail" sm={2}><h6>Upload image: </h6></Label>
                    <Col sm={10}>
                        <Input placeholder="URL" id="thumbnail"
                            onChange={e => setThumbnail(e.target.value)} />
                    </Col>    
                    {/* <Label id="thumbnail" style={{ backgroundImage: `url(${preview})` }} >   */}
                        {/* <img src={cameraIcon} alt="icon" style={{ maxWidth: "50px" }} /> 
                        className={thumbnail ? "has-thumbnail" : ""}                        */}
                    {/* </Label> */}
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
