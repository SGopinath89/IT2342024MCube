import React, { useState } from 'react';
import './Login.css';
import { useHistory } from 'react-router-dom'; // Import useHistory

const Login = () => {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    });

    const history = useHistory(); // Initialize useHistory

    const changehandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const login = async () => {
        let responseData;
        await fetch('http://localhost:4000/login', {
            method: "POST",
            headers: {
                Accept: 'application/form-data',
                'Content-Type': "application/json"
            },
            body: JSON.stringify(formData),
        }).then((response) => response.json())
            .then((data) => responseData = data);

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            history.push("/admin"); // Redirect to the Admin panel
        } else {
            alert(responseData.errors);
        }
    };

    // Rest of your component code
};

export default Login;
