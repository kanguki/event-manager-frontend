import React, { useEffect, useState } from 'react'
import { Alert } from 'reactstrap';
import api from '../../../services/api';
import './confirmPage.css'

export default function ConfirmPage({history}) {

    const [confirm, setConfirm] = useState(false)
    const [alreadyConfirm, setAlreadyConfirm] = useState(false)
    const [err, setErr] = useState(true)
    
    const user = localStorage.getItem('token')

    useEffect(() => {
        cfmMessage()       
    }, [])

    const cfmMessage = async () => {
        const url = window.location.pathname;
        const result = await api.get(`${url}`)
        if (result && !user) {
            const { user_id, token } = result.data
            localStorage.setItem('user_id', user_id)
            localStorage.setItem('token', token)
            setConfirm(true)
            setErr(false)
            setTimeout(() => {
                history.push('/login')
            },4000)
            
        } else if (result && user) {
            setAlreadyConfirm(true)
            setErr(false)
            return
        } 

    }

    return (
        <div className="cfm-container">
            <h2 className="header">Confirmation page</h2>
            {confirm ?
                (<div>
                    <h3 className="welcome">Thank you for registering.</h3>
                    <h5>Your account is confirmed now.</h5>
                    <Alert color="info">You are now able to use our services</Alert> 
                    <p>
                    <i className="fas fa-spinner fa-pulse"></i>
                     Redirecting to login page...</p>
                </div>) :
            ""}
            {alreadyConfirm ?
                (<p>This email has already been confirmed!</p>) :
            ""}
            {err ? 
                (<div>
                    <h3 className="welcome">Error 404</h3>
                    <h6>We are sorry</h6>
                    <p>We can't find what you are looking for</p>
                </div>) :
            ""}
        </div>
    )
}