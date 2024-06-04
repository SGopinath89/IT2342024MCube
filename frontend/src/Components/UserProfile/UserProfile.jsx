import React, { useState } from 'react';
import './UserProfile.css';
import UserProfile_icon from '../Assets/UserProfile_icon.png';

const UserProfile = ({ user, onChangePassword }) => {
    const [showProfile, setShowProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: ''
    });

    const toggleProfile = () => {
        if (showProfile) {
            // Reset the change password state when closing the profile dropdown
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
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    {!showChangePassword && (
                        <button className='change-password-btn' onClick={() => setShowChangePassword(true)}>Change Password</button>
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
                </div>
            )}
        </div>
    );
};

export default UserProfile;
