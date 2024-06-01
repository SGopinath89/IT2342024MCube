import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cartIcon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
  const [menu, setMenu] = useState("Shop");
  const { getTotalCartItems } = useContext(ShopContext);

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link to='/'>Shop</Link>
          {menu === 'shop' && <hr />}
        </li>
        <li onClick={() => setMenu("mens")}>
          <Link to='/mens'>Men</Link>
          {menu === 'mens' && <hr />}
        </li>
        <li onClick={() => setMenu("womens")}>
          <Link to='/womens'>Women</Link>
          {menu === 'womens' && <hr />}
        </li>
        <li onClick={() => setMenu("kids")}>
          <Link to='/kids'>Kids</Link>
          {menu === 'kids' && <hr />}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token') ? (
          <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/'); }}>Logout</button>
        ) : (
          <Link to='/login'><button>Login</button></Link>
        )}
        <Link to='/cart'>
          <img src={cartIcon} alt="Cart" />
        </Link>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
