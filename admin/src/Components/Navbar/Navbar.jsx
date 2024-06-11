import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import navProfile from '../../assets/nav-profile.svg'

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <div className='navbar'>
        <img className='nav-logo' src={navlogo} alt="" />
        
        {isLoggedIn && <button className='logout' onClick={handleLogout}>Logout</button>}
    </div>
  )
}

export default Navbar