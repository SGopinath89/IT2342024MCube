import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cartIcon from '../Assets/cart_icon.png';
import UserProfile from '../UserProfile/UserProfile';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
  const [menu, setMenu] = useState("Shop");
  const [user, setUser] = useState({ name: '', email: '' });
  const { getTotalCartItems, clearCart } = useContext(ShopContext);
  const navigate = useNavigate(); // Use navigate hook from React Router

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        const response = await fetch('http://localhost:4000/user/getuser', {
          headers: {
            'auth-token': token,
          },
        });
        const data = await response.json();
        setUser({ name: data.name, email: data.email });
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('cartItems');
    clearCart();
    navigate('/login'); // Redirect to login page after logout
  };

  const handleChangePassword = async (oldPassword, newPassword) => {
    const response = await fetch('http://localhost:4000/auth/changepassword', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token'),
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const result = await response.json();
    if (result.success) {
      alert('Password changed successfully');
    } else {
      alert('Error changing password: ' + result.message);
    }
  };

  const handleDeleteAccount = async () => {
    const response = await fetch('http://localhost:4000/auth/deleteaccount', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token'),
      },
    });
    const result = await response.json();
    if (result.success) {
      alert('Account deleted successfully');
      handleLogout(); // After deleting account, logout and redirect to login page
    } else {
      alert('Error deleting account: ' + result.message);
    }
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
        <Link to='/cart'>
          <img src={cartIcon} alt="Cart" />
        </Link>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
        {localStorage.getItem('auth-token') ? (
          <>
            <UserProfile user={user} onChangePassword={handleChangePassword} onDeleteAccount={handleDeleteAccount} />
            <button onClick={handleLogout}>Logout</button>
            <div className="nav-user-orders">
              <Link to='/orders'>Orders</Link>
            </div>
          </>
        ) : (
          <Link to='/login'><button>Login</button></Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
