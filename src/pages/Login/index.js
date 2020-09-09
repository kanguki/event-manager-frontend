import React, { useState } from 'react'
import api from '../../services/api'
import { Button, Form, FormGroup, Input, Container, Alert, Col, Row } from 'reactstrap';

export default function Login({history}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorFill, setErrorFill] = useState(false)
    const [errorAuth,setErrorAuth] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            //if the form is filled, validate user, if user exists, direct to dashboard, else err 
            // else send  error not yet fully filled
            if ( email!=="" && password!=="" ) {
                const response = await api.post('/login', { email, password })
                const userId = response.data._id || false;

                if (userId) {
                    localStorage.setItem('user', userId)
                    history.push('/dashboard')
                } else {
                    const { message } = response.data
                    setErrorAuth(message)
                    setTimeout(() => {
                        setErrorAuth(null)
                    }, 3000)
                }
            } else {
                setErrorFill(true)
                setTimeout(() => {
                    setErrorFill(false)
                }, 2000)
            }
            
        } catch (error) {
            Promise.reject(error)
        }

        
    }

    return (
        <Container>
            <h1>Welcome to login page</h1>
            <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Input type="email" name="email" id="email" placeholder="Your Email"
                        onChange={e => setEmail(e.target.value)}/>
                </FormGroup>

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Input type="password" name="password" id="password" placeholder="Your Password"
                    onChange={e => setPassword(e.target.value)}/>
                </FormGroup>
   
                <Row>
                    <Col xs="6" sm="8">
                        <Button className="submit-btn">Login</Button>
                        </Col>
                        <h4>or</h4>
                        <Col xs="6" sm="3">
                        <Button className="secondary-btn" onClick={() => history.push('/sign-up')}>
                            Create new account
                        </Button>
                    </Col>
                </Row>
            </Form>
            {
                errorFill ? 
                    (<Alert className="fill-err"
                        color="warning">Please fill in all required parts</Alert>) :
                    ""
            }
            {
                errorAuth ?
                    (<Alert className="auth-err"
                    color="warning">{errorAuth}</Alert>) :
                    ""
            }
        </Container>
    )
}