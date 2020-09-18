import React, {  useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({history}) {
    const [click, setClick] = useState(false)
    
    const handleClick = (e) => {
        setClick(!click)
    }

    // const [button, setButton] = useState(true)

    const closeMobileMenu = (e) => {
        setClick(false)
    }

    const loggedIn = localStorage.getItem('token')
    const user_id = localStorage.getItem('user_id')

    const handleLoggout = () => {
        let cfm = window.confirm("You want to log out?")
        if (cfm === true) {
            localStorage.removeItem('token')
            localStorage.removeItem('user_id')
            window.location.reload()
        }
    }



    
    return (
        <div className="nav">            
        <div className="nav-container">
                         
                <Link to="/" className="logo" onClick={e => closeMobileMenu(e)} title="Home page">
                    Eman</Link>
            
                <ul className={click ? "nav-menu mobile" : "nav-menu"}>
                <li className="nav-item">
                        <Link to="/" className="nav-link"
                            onClick={e => closeMobileMenu(e)}>
                            {!click ? <i className="fa fa-th"></i> : "Dashboard"}</Link>   
                </li>
                <li className="nav-item">
                        <Link to="/events" title="Create event"
                            className="nav-link" onClick={e => closeMobileMenu(e)}>
                            {!click ? <i className="fa fa-file-text"></i> : "Create"}</Link>   
                </li>
                <li className="nav-item">
                        <Link to="/manage-requests"
                            className="nav-link" title="Manage requests"
                            onClick={e => closeMobileMenu(e)}>
                            {!click ? <i className="fa fa-tasks"></i> : "Manage"}</Link>   
                </li>    
                
                <li className="nav-item">
                    <Link to="/my-subscriptions"
                        title="My Subscription" className="nav-link"
                        onClick={e => closeMobileMenu(e)}>
                    {!click? <i className="fa fa-cart-arrow-down"></i>: "Subscription"}</Link>   
                </li>        
                    {loggedIn && user_id ?
                    (<>
                        <li className="nav-item">
                            <Link to="/profile" title="My profile"
                                className="nav-link" onClick={e => closeMobileMenu(e)}>
                            {!click ? <i className="fa fa-user-circle"></i> : "Profile"} </Link>  
                        </li>
                        <li className="nav-item log">
                            <Link to="/"  className="nav-link" onClick={handleLoggout}>Log out </Link>  
                        </li>
                        
                    </>) :
                    (<>                            
                        <li className="nav-item log">
                            <Link to="/login" className="nav-link log" onClick={e=>closeMobileMenu(e)}>Sign in</Link>   
                        </li>
                        <li className="nav-item log">
                            <Link to="/sign-up" className="nav-link log" onClick={e=>closeMobileMenu(e)}>Sign up</Link>   
                        </li>
                    </>)
                    }   
                
            </ul>
                <button className="menu-icon-btn" title="menu"
                    onClick={(e) => handleClick(e)  }>
                {click ? <i className="fa fa-close"></i>: <i className="fa fa-bars"></i> }
                </button>

        </div>
        </div>
    )
}


