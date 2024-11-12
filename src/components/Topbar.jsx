import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Topbar.css';

const Topbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine the title based on the current path
    const getTitle = () => {
        switch (location.pathname) {
            case '/dashboard':
                return 'Dashboard';
            case '/dashboard/new-orders':
                return 'New Orders';
            case '/dashboard/ready-orders':
                return 'Ready Orders';
            case '/dashboard/profile':
                return 'Profile';
            default:
                return 'Dashboard';
        }
    };

    const handleLogout = () => {
        alert('Logged out');
        navigate('/'); // Redirect to the login page (or home) after the alert
    };

    return (
        <div className="topbar">
            <h1>{getTitle()}</h1>
            <div className="topbar-right">
                
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default Topbar;
