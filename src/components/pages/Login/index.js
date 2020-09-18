import React, { useState } from 'react'
import api from '../../../services/api'
import { Button, Form, FormGroup, Input, Container, Alert, Col, Row } from 'reactstrap';
import './login.css'

export default function Login({history}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorFill, setErrorFill] = useState(false)
    const [errorAuth, setErrorAuth] = useState(null)
    // const [errNotConfirm, setErrNotConfirm] = useState(null)
    // const [click,setClick] = useState(false)
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            //if the form is filled, validate user, if user exists, direct to dashboard, else err 
            // else send  error not yet fully filled
            if ( email!=="" && password!=="" ) {
                const response = await api.post('/login', { email, password })
                const userId = response.data.user_id 
                const token = response.data.token 
 
                if ( token && userId) {
                    localStorage.setItem('token', token)
                    localStorage.setItem('user_id', userId)
                    history.push('/')
                    window.location.reload()
                } else {
                    setErrorAuth(response.data.message)
                    setErrorFill(null)
                }
            } else {
                
                setErrorFill(true)
                setErrorAuth(null)
                setTimeout(() => {
                    setErrorFill(false)
                }, 2000)
            }
            
        } catch (error) {
            Promise.reject(error)
        }
 
    }

    // const handleGetLink = async () => {
    //     setClick(true)
    //     setErrNotConfirm(`Sending... `)
    //     const res = await api.post('/reconfirm-email', { email: email })
    //     if (res.data.message) {
    //         setTimeout(() => {
    //             setErrNotConfirm(res.data.message)
    //         },2000)  
    //     } else {
    //         setErrNotConfirm(`Something went wrong. Please try again after 10 minutes`)
    //     }
    // }

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
            {/* {
                errNotConfirm && click ? 
                    (<p className="auth-err get-link">
                        {errNotConfirm}<i className="fas fa-spinner fa-pulse"></i>
                    </p>) :
                    ""
            }
            {
            errNotConfirm && !click ? 
                (<div className="ask-reconfirm">
                    <p>Not received a confirmation link?</p>
                    <p>Click <span className="auth-err get-link"
                        onClick={handleGetLink}>{errNotConfirm} </span>to get it again.
                    </p>
                
                </div> 
                ) :
                    ""
            } */}
        </Container>
    )
}