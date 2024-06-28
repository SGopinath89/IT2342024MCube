import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';  // Add this line
import './UserProfile.css';
import UserProfile_icon from '../Assets/UserProfile_icon.png';

const UserProfile = ({ onChangePassword, onDeleteAccount }) => {
    const [showProfile, setShowProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: ''
    });
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:4000/user/getuser', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setError('Failed to fetch user data');
                }
            } catch (error) {
                setError('Error fetching user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const toggleProfile = () => {
        if (showProfile) {
            setShowChangePassword(false);
            setPasswords({ oldPassword: '', newPassword: '' });
        }
        setShowProfile(!showProfile);
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = () => {
        if (typeof onChangePassword === 'function') {
            onChangePassword(passwords.oldPassword, passwords.newPassword);
        }
        setPasswords({ oldPassword: '', newPassword: '' });
        setShowChangePassword(false);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            if (typeof onDeleteAccount === 'function') {
                await onDeleteAccount();
            }
        }
    };

    return (
        <div className="user-profile">
            <img
                src={UserProfile_icon}
                alt="Profile Icon"
                className="profile-icon"
                onClick={toggleProfile}
            />
            {showProfile && (
                <div className="profile-dropdown">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <>
                            <p>Name: <b>{user.name}</b></p>
                            <p>Email: <b>{user.email}</b></p>
                            {!showChangePassword && (
                                <div className='button-container'>
                                    <button className='change-password-btn' onClick={() => setShowChangePassword(true)}>Change Password</button>
                                    <button className='delete-account-btn' onClick={handleDeleteAccount}>Delete Account</button>
                                </div>
                            )}
                            {showChangePassword && (
                                <div className="change-password-form">
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        placeholder="Old Password"
                                        value={passwords.oldPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="New Password"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    <button onClick={submitPasswordChange}>Submit</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

UserProfile.propTypes = {
    onChangePassword: PropTypes.func.isRequired,
    onDeleteAccount: PropTypes.func.isRequired
};

export default UserProfile;
