import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "", // Changed from 'username' to 'name'
    password: "",
    email: ""
  });
  const [agree, setAgree] = useState(false);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setAgree(!agree);
  };

  const login = async () => {
    console.log("Login Executed", formData);
    let responseData;
    await fetch('http://localhost:4000/auth/login', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/json"
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json())
      .then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    if (!agree) {
      alert("You must accept the terms and privacy policy to register.");
      return;
    }
    console.log("Signup Executed", formData);
    let responseData;
    await fetch('http://localhost:4000/auth/signup', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/json"
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json())
      .then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className='loginsignup'>
      <div className='loginsignup-container'>
        <h1>{state}</h1>
        <div className='loginsignup-fields'>
          {state === "Sign Up" && (
            <input
              name='name' // Changed from 'username' to 'name'
              value={formData.name} // Changed from 'formData.username' to 'formData.name'
              onChange={changeHandler}
              type="text"
              placeholder='Your Name'
            />
          )}
          <input
            type="email"
            name='email'
            value={formData.email}
            onChange={changeHandler}
            placeholder='Email'
          />
          <input
            type="password"
            name='password'
            value={formData.password}
            onChange={changeHandler}
            placeholder='Password'
          />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
        {state === "Sign Up" ? (
          <>
            <p className='loginsignup-login'>Already have an account? <span onClick={() => { setState("Login") }}>Login</span></p>
            <div className='loginsignup-agree'>
              <input type="checkbox" checked={agree} onChange={handleCheckboxChange} />
              <p>By clicking, I agree to the terms and privacy policy</p>
            </div>
          </>
        ) : (
          <p className='loginsignup-login'>Create an account? <span onClick={() => { setState("Sign Up") }}>Register here</span></p>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
