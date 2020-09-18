import React,{ useState, useEffect} from 'react'
import { Alert, Badge, Button, CardLink, ListGroup, ListGroupItem } from 'reactstrap';
import api from '../../../services/api';
import './eventRegistration.css'
import moment from 'moment'


export default function EventRegistrations({history}) {
    const token = localStorage.getItem('token')
    const [requests,setRequests] = useState([])
    const [joinRequestHandle, setJoinRequestHandle] = useState(null)

    useEffect(() => {
        getAllRequestsToThisEvent()
    }, [])
    
    const getAllRequestsToThisEvent = async () => {
        const start = window.location.href.indexOf('/#')
        const path = window.location.href.slice(start+2)
        const res = await api.get(`${path}`, { headers: { token } })
        setRequests(res.data)
    }
    const acceptRequestHandler = async (request,person) => {
        await api.post(`/registration/${request._id}/approve`)
        setJoinRequestHandle(`Accept ${person}'s request!`)
        setTimeout(() => {
            setJoinRequestHandle(null)
            getAllRequestsToThisEvent()
        }, 500);
    }
    const rejectRequestHandler = async (request, person) => {
        const cfm = window.confirm('Rejecting request ?')
        if (cfm === true) {
            await api.delete(`/registration/remove/${request._id}`,{headers: {token}})     
            setJoinRequestHandle(`Reject ${person}'s request !`)
            setTimeout(() => {
                setJoinRequestHandle(null)
                getAllRequestsToThisEvent()
            }, 500);
        }else{
            return
        }
        
    }
    return (
        <>
            <ListGroupItem>
            {
                requests.length !== 0 ?
                (
                <div className="p-btn">
                    <h5>All requests to join {requests[0].event_title} <Badge pill>{requests.length}</Badge></h5>
                    <img src={requests[0].event_image}
                        alt={moment(requests[0].date).format('LLLL')}
                        title={moment(requests[0].date).format('LLLL')}
                        className="elastic"/>
                </div>
                ) :
                (
                     <Alert color="info">There is no more requests to this event!</Alert>       
                )
            }
            </ListGroupItem>
            <ListGroup>
            {
            requests.map(r => 
            !joinRequestHandle ?    
                    (<ListGroupItem key={r._id}>
                        <div className="p-btn">
                            <strong>{r.email}</strong>
                            <div> </div>
                            <div className="col-btn">

                            {
                                r.approved ? "" : <Button color="primary" onClick={()=>acceptRequestHandler(r,r.email)}>Accept</Button>
                            }
                            
                            {
                                r.approved ?
                                    <Button color="danger" onClick={()=>rejectRequestHandler(r,r.email)}><i className="fa fa-trash"></i></Button> :
                                    <Button color="danger" onClick={()=>rejectRequestHandler(r,r.email)}>Reject</Button>
                            }
                            </div>
                        </div>
                    
                </ListGroupItem>) : 
            <Alert className="noti">{joinRequestHandle}</Alert>                  
                )
            }
            </ListGroup>
            <CardLink onClick={()=>history.push('/manage-requests')}>Go back <i className="fa fa-history"></i></CardLink>
        </>
    )
}