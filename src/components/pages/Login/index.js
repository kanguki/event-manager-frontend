import React, { useState } from 'react'
import api from '../../../services/api'
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
                const userId = response.data.user_id || false;
                const token = response.data.token || false
 
                if ( token && userId) {
                    localStorage.setItem('token', token)
                    localStorage.setItem('user_id', userId)
                    history.push('/')
                } else {
                    const { message } = response.data
                    setErrorAuth(message)
                    setTimeout(() => {
                        setErrorAuth(null)
                    }, 2000)
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
            <h6>Login page</h6>
            <Form onSubmit={handleSubmit}>
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
                        <Button className="submit-btn">Sign in</Button>
                        </Col>
                        <Col xs="6" sm="4">
                        <Button className="secondary-btn" onClick={() => history.push('/sign-up')}>
                            Sign up
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