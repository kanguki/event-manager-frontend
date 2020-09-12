import React, {  useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
    const [click, setClick] = useState(false)
    const handleClick = () =>setClick(!click)

    // const [button, setButton] = useState(true)

    const closeMobileMenu = () => setClick(false)

    // const showButton = () => {
    //     if(window.innerWidth <=720) setButton(false)
    //     else setButton(true)
    // }
    // useEffect(() => {
    //     showButton()
    // },[])

    //window.addEventListener('resize',showButton)
    
    return (
        <div className="nav">            
        <div className="nav-container">
                         
            <Link to="/" className="logo" onClick={closeMobileMenu}>Logo</Link>
            
            <ul className={click ? "nav-menu mobile" :"nav-menu"}>
                <li className="nav-item">
                        <Link to="/dashboard" className="nav-link"
                            onClick={closeMobileMenu}>Dashboard</Link>   
                </li>    
                <li className="nav-item">
                        <Link to="/events" className="nav-link" onClick={closeMobileMenu}>Create</Link>   
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Sign in</Link>   
                </li>
                <li className="nav-item">
                    <Link to="/sign-up" className="nav-link" onClick={closeMobileMenu}>Sign up</Link>   
                </li>
                <li className="nav-item">
                    <Link to="/subscription" className="nav-link" onClick={closeMobileMenu}>Subscription</Link>   
                </li>               
            </ul>
                <button className="menu-icon-btn" title="menu" onClick={handleClick}>
                {click ? <i class="fa fa-close"></i>: <i class="fa fa-bars"></i> }
                </button>

        </div>
        </div>
    )
}


