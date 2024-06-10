import React, { useState } from 'react';
import './Login.css';
import Admin from '../Admin/Admin';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loggedIn, setLoggedIn] = useState(false); // State to track login status

    const changehandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const login = async () => {
        try {
            const response = await fetch('http://localhost:4000/admin/login', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(formData),
            });
            const responseData = await response.json();
            if (responseData.success) {
                localStorage.setItem('adminToken', responseData.token);
                // Set loggedIn state to true after successful login
                setLoggedIn(true);
            } else {
                alert(responseData.errors);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("An error occurred during login. Please try again.");
        }
    };

    return (
        <div className="login-container">
            {!loggedIn ? ( // Render login form if not logged in
                <>
                    <h2>Login</h2>
                    <form>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={changehandler} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={changehandler} />
                        </div>
                        <button type="button" onClick={login}>Login</button>
                    </form>
                </>
            ) : (
                <Admin /> // Render Admin component after successful login
            )}
        </div>
    );
};

export default Login;
