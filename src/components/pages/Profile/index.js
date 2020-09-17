import React, { useEffect, useState } from 'react'
import {Alert, Button, Input, InputGroup, InputGroupAddon} from 'reactstrap'
import api from '../../../services/api'
import './profile.css'

export default function Profile({history}) {
    const token = localStorage.getItem('token')
    const user_id = localStorage.getItem('user_id')
    const [user, setUser] = useState({})
    const [change, setChange] = useState(false)   
    const [check,setCheck] = useState(false)
    const [changePw, setChangePw] = useState(false)
    const [currPass, setCurrPass] = useState(null)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [newPassWord, setNewPassWord] = useState("")
    const [warning,setWarning] = useState(null)
    const [changeOk, setChangeOk] = useState(false)
    const [success, setSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState(null)
    const [requestDelete, setRequestDelete] = useState(false)

    useEffect(() => {
        getUser() 
    }, [])

    const getUser = async () => {
        if(!token) history.push('/')
        const result = await api.get('/users/user/id', { headers: { token } })
        setUser(result.data)
    }

    const handleCancel = () => {
        window.location.reload()
    }
    const handleCheck = async () => {
        const email = user.email 
        const result = await api.post('/login', { email , password: currPass })
        if (result.data.user_id === user_id) {
            setCheck(true)
            if(!requestDelete) setChangeOk(true)
            setWarning(null)
        }
        else {
            setChange(false)
            setWarning('Incorect password')
            setCurrPass("")
            return
        }
    }
    
    const checkRepeat = async (val) => {
        if (val==="") setWarning("")
        if (val !== newPassWord) {
            setWarning("Password doesn't match")
        }
        else {
            setWarning(null)
        }
    }
    const handleSubmitUpdate = async () => {
        if (!warning && changeOk) {
            await api.post('/user/update', { firstName, lastName, password: newPassWord }, { headers: { token } })
            setSuccessMessage("We sucessfully updated your information. Redirecting to dashboard...")
            setSuccess(true)
            
            setTimeout(() => {
                history.push('/')
                
            },2000)
        }
    }
    const handleDelete = async () => { 
        
        const cfm = window.confirm('All events, subscriptions and other information will be deleted.\n Do you want to continue?')
        if (cfm === true) {
            await api.delete('/user/my-account', { headers: { token } })
            localStorage.removeItem('user_id')
            localStorage.removeItem('token')
            setSuccessMessage("We are sorry to let you go 😧")  

            history.push('/')
            window.location.reload()
        }else return                    

    }
    return user ?
        (<>
            <h3>Hello {user.firstName}</h3>
            <div className="col-input">
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button outline color="secondary" className="label">Email: </Button>
                    </InputGroupAddon>
                    <Input type="email" defaultValue={user.email}  disabled/>           
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button outline color="secondary" className="label">First name: </Button>
                    </InputGroupAddon>
                    <Input type="text" defaultValue={user.firstName}
                        onChange={(e)=>setFirstName(e.target.value)}
                        disabled={changeOk ? false : true} />            
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button outline color="secondary" className="label">Last name: </Button>
                    </InputGroupAddon>
                    <Input type="text" defaultValue={user.lastName}
                        onChange={(e)=>setLastName(e.target.value)}
                        disabled={changeOk ? false : true} />                    
                </InputGroup>
                
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button outline color="secondary"
                            className="label">New password: </Button>
                    </InputGroupAddon>
                    <Input type="password"
                        onChange={(e)=>setNewPassWord(e.target.value)}
                        disabled={changePw ? false : true} />    
                    <InputGroupAddon addonType="append">
                        <Button outline color="danger" disabled={changeOk ? false : true}
                            
                        onClick={() => setChangePw(!changePw)}>Change</Button>
                    </InputGroupAddon>
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button outline color="secondary" className="label">Repeat new password: </Button>
                    </InputGroupAddon>
                    <Input type="password"
                        onChange={(e) => checkRepeat(e.target.value)}
                        disabled={changePw ? false : true} />    
                </InputGroup>
                {
                    warning ? <p><i className="fa fa-warning"></i>{warning}</p> : <p></p>
                }
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button outline color="secondary"
                            className="label">Current password: </Button>
                    </InputGroupAddon>
                    <Input type="password" disabled={change ? false : true}
                        placeholder={change ? "Enter password to authenticate" : ""} 
                        onChange={(e) => setCurrPass(e.target.value)} />  
                    <InputGroupAddon addonType="append">
                        <Button outline color="danger" disabled={change? false : true}
                            onClick={handleCheck}>
                            Check {check ? <i className="fa fa-check"></i> : <i className="fa fa-pencil-square-o"></i>}
                        </Button>
                    </InputGroupAddon>
                </InputGroup>
                
            </div>
            {change ?
            (<div className="row-btn">
                <Button className="green" onClick={handleCancel}
                        outline color="link">Cancel</Button>
                {requestDelete ?
                    (<Button className="submit" onClick={handleDelete}
                    disabled={check? false : true}
                    outline color="link">Submit {check ? <i className="fa fa-trash"></i> : ""}{success ? <i className="fa fa-check"></i> : ""}</Button>)
                     : 
                    (<Button className="submit" onClick={handleSubmitUpdate}
                    disabled={check && !warning? false : true}
                    outline color="link">Update{success ? <i className="fa fa-check"></i> : ""}</Button> )
                }
                
            </div>) :
            ""}
            {change ? "" : 
            (<div className="row-btn">
                <Button className="blue" onClick={()=>setChange(true)}
                    outline color="link">Change general information</Button>      
                <Button className="red"
                    outline color="link"
                        onClick={() => { setChange(true);setRequestDelete(true)}}>Delete account</Button>
            </div>)}
            {
                successMessage ? <Alert color="success">{successMessage}</Alert> : ""
            }
        </>) : 
        (<Alert>Please log in or sign up to use our services</Alert>)
}