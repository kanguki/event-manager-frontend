import React, { useState } from 'react'
import api from '../../../services/api'
import { Button, Form, FormGroup, Input, Container, Col, Alert, Row } from 'reactstrap';

export default function Register({history}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [errorMember, setErrorMember] = useState(null)
    const [errorFillForm, setErrorFillForm] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email===""|| password===""|| firstName===""|| lastName==="") {
            setErrorFillForm("Please fill in all required parts.")
            setTimeout(() => {
                setErrorFillForm(null)
            },2000)
        } else {
            const response = await api.post('/sign-up', { email, password, firstName, lastName })
            const token = response.data.token || false;
            const user_id = response.data.user_id || false

            if (user_id && token) {
                localStorage.setItem('token', token)
                localStorage.setItem('user_id', user_id)
                history.push('/')
            } else {
                const { message } = response.data
                setErrorMember(message)
                setTimeout(() => {
                    setErrorMember(null)
                },2000)
            }
        }

        
    }

    return (
        <Container>
            <h6>Sign up</h6>
            <Form onSubmit={handleSubmit}>
                <FormGroup >
                    <Input name="firstName" id="firstName" placeholder="Your First Name"
                        onChange={e => setFirstName(e.target.value)}/>
                </FormGroup>
                <FormGroup >
                    <Input name="lastName" id="lastName" placeholder="Your Last Name"
                        onChange={e => setLastName(e.target.value)}/>
                </FormGroup>
                <FormGroup >
                    <Input type="email" name="email" id="email" placeholder="Your Email"
                        onChange={e => setEmail(e.target.value)}/>
                </FormGroup>

                <FormGroup >
                    <Input type="password" name="password" id="password" placeholder="Your Password"
                    onChange={e => setPassword(e.target.value)}/>
                </FormGroup>
                <Row>

                <Col xs="6" sm="8">
                    <Button className="submit-btn" >Sign up</Button>
                </Col>
                
                <Col xs="6" sm="4">
                    <Button className="secondary-btn" onClick={() => history.push('/login')}>
                        Sign in
                    </Button>
                </Col>
                </Row>
            </Form>
            {errorFillForm ? (<Alert color="warning">{errorFillForm}</Alert>) : ""}
            {errorMember ? (<Alert color="warning">{errorMember}</Alert>) : ""}
        </Container>
    )
}