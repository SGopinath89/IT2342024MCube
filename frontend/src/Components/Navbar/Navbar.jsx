import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cartIcon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
  const [menu, setMenu] = useState("Shop");
  const { getTotalCartItems, clearCart } = useContext(ShopContext); // Import clearCart function from ShopContext

  const handleLogout = () => {
    // Clear user authentication token
    localStorage.removeItem('auth-token');

    // Clear cart data from local storage
    localStorage.removeItem('cartItems');

    // Clear the cart in the context
    clearCart();

    // Redirect to the login page or any other page
    window.location.replace('/login');
  };

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
          <button onClick={handleLogout}>Logout</button> // Use handleLogout function for logout
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
