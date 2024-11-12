// Profile.jsx
import React from 'react';
import './Profile.css';

const Profile = () => {
    const user = {
        name: 'Ovini',
        email: 'biryanikade@gmail.com',
        role: 'Delivery Manager',
        joined: '2022-05-01',
    };

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <div className="profile-details">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Date Joined:</strong> {user.joined}</p>
            </div>
            <button className="edit-profile-button">Edit Profile</button>
        </div>
    );
};

export default Profile;
