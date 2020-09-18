import React, { useEffect, useState } from 'react'
import { Alert, Button } from 'reactstrap'
import api from '../../../services/api'
import './mySubscribe.css'

export default function MySubscription({history}) {
    const token = localStorage.getItem('token')
    const [subs, setSubs] = useState([])
    const [disJoin,setDisjoin] =useState(null)
    useEffect(() => {
        getSubs()
    }, [])

    const getSubs = async () => {
        
        if (token) {
            
            const result = await api.get('/registration/my/registrations', { headers: { token } })
            if (result) {
                setSubs(result.data)     
            }
        }
        
    }
    const cancelHandler = async (s_id, event) => {        
        const cfm = window.confirm('Are you sure to cancel this request')
        if (cfm === true) {
            try {
                await api.delete(`/registration/remove/${s_id}`, { headers: { token } })
                setDisjoin(`You've cancelled request for event ${event}`)
                setTimeout(() => {
                    setDisjoin(null)
                    getSubs()
                },1000)
            } catch (err) {
                return
            }
        } else {
            return
        }
    }
    return (
        <>
            <h4 style={{fontWeight: "700"}}>My registrations</h4>
            <h6 style={{fontStyle: "italic"}}>Click on <span style={{color: "red"}}>image</span> to see details</h6>
        <ol>
        
        {
                subs.map(s => 
                    disJoin ? (
                        <Alert className="noti" key={s._id} color={"danger"}>
                            {disJoin}
                        </Alert>) :
                        (<li key={s._id} className="list-item">
                            <div className="p-btn">
                                <span><strong>{s.event_title}</strong></span>
                                <div> </div>
                                <div className="col-btn">
                                    <Button color="danger"
                                    onClick={() =>
                                        cancelHandler(s._id, s.event_id)}>
                                        <i className="fa fa-trash"></i>
                                    </Button>
                                    
                                </div>    
                            </div>
                            <img id="lead" src={s.event_image} alt={s.event_title} height="100px"
                                onClick={() => history.push(`/details/event/${s.event_id}`)} title="Click to see details"/>
                            {s.approved ?
                                (<p className="info green"><i className="fa fa-check-square"></i></p>) :
                                (<p className="info red">waiting...  <i className="fas fa-spinner fa-pulse"></i></p>)}
                            
                        </li>)
                    )
            } 
            {
                token ? "" : <Alert className="noti" > Please sign in or sign up to see this section </Alert>     
            }
            {
                token && subs.length === 0 ?
                    (<Alert className="noti" >
                        You haven't requested to join any events
                    </Alert>) :
            ""}
        </ol>
        </>
    )
}