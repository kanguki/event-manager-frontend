import React, { useState, useEffect } from 'react'
import api from '../../../services/api'
import { Alert, Button } from 'reactstrap'
import './manageRequest.css'

export default function ManageRequests({history}) {
    const token = localStorage.getItem('token')
    const [requestsArray, setRequestsArray] = useState([])
    const [arrayNotChecked,setArrayNotChecked] = useState([])
    const [joinRequestHandle, setJoinRequestHandle] = useState(null)
    const [selectAll,setSelectAll] = useState(false)
    useEffect(() => {
        getRequests()
    }, [])

    const getRequests = async () => {
        if(!token) history.push('/')
        const results = await api.get('/registration/manage/requests', { headers: { token } })
        setRequestsArray(results.data)  
        setArrayNotChecked(results.data)
        setSelectAll(false)
    }

    const getAllRequests = async () => {
        const results = await api.get('/registration/manage/requests/all', { headers: { token } })
        setRequestsArray(results.data)
        setSelectAll(true)
    }
    const acceptRequestHandler = async (request,person,event) => {
        await api.post(`/registration/${request._id}/approve`)
        setJoinRequestHandle(`Accept ${person} to join ${event}!`)
        setTimeout(() => {
            setJoinRequestHandle(null)
            selectAll ? getAllRequests() : getRequests()
        }, 500);
    }
    const rejectRequestHandler = async (request,person,event) => {
        await api.delete(`/registration/remove/${request._id}`,{headers: {token}})     
        setJoinRequestHandle(`Block ${person}'s request to join ${event}!`)
        setTimeout(() => {
            setJoinRequestHandle(null)
            selectAll ? getAllRequests() : getRequests()
        }, 500);
    }
    // /event/registrations/:event_id
    return (
        <>
            <h4 style={{fontWeight: "700"}}>List of requests to join your events</h4>
            <h6 style={{fontStyle: "italic"}}>Click on event's title to see list of each event</h6>
            <div className="row-btn">

                <Button outline color="primary" title="Unchecked requests"
                    onClick={getRequests}
                    active={selectAll ? false : true}>
                    <i className="fa fa-search"></i>
                </Button>
                <Button outline color="secondary" title="All requests"
                    onClick={getAllRequests}
                    active={selectAll ? true : false}><i className="fa fa-search-plus"></i></Button>
            </div>
        <ul>
            {
                requestsArray.map(r => 
                    joinRequestHandle ?
                        (<Alert className="noti" key={r._id}
                            color={joinRequestHandle.includes('Accept') ? "info" : "danger"}>
                            {joinRequestHandle}</Alert>) :
                        (< li key={r._id} className="list-item">
                        <div className="p-btn"> 
                            <span><strong>{r.email}</strong> requested to join 
                                <strong className="event" title="Click to see all requests"
                                    onClick={() => history.push(`/event/registrations/${r.event_id}`)}>
                                {r.event_title}
                                </strong>
                            </span>
                            <div> </div>
                            <div className="col-btn">                               
                                <Button outline color="primary" 
                                    className={!arrayNotChecked.includes(r) ? "hide" : "" }
                                    onClick={() =>
                                        acceptRequestHandler(r, r.user_id, r.event_id)}>
                                    Accept</Button>
                                <Button color="danger "
                                    onClick={() =>
                                        rejectRequestHandler(r, r.user_id, r.event_id)}>
                                        {selectAll? <i className="fa fa-trash"></i> : "Reject"}
                                    </Button>
                                    {r.approved ?
                                        <p className="info green"><i className="fa fa-check-square"></i></p> :
                                        ""}
                            </div>
                        </div>
                        <p className="p-btn">
                            <img src={r.event_image} alt={r.event_title} height="100px" />
                            
                        </p>    
                    </li>)
    
                )
                }
            {
                token ? "" : <Alert className="noti" > Please sign in or sign up to see this section </Alert>     
            }
            {
                token && requestsArray.length === 0 && !selectAll ?
                    (<Alert className="noti" >
                        There's no more requests you didn't check
                    </Alert>) :
            ""}
            {
                token && requestsArray.length === 0 && selectAll ?
                (<Alert className="noti" >
                    We couldn't find any requests.
                    No one has register to join your events or you haven't created one...
                </Alert>) :
            ""}
        </ul>
        </>
    )
    
}