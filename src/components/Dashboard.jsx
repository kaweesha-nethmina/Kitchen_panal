import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Dashboard.css';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isDashboardRoot = location.pathname === "/dashboard"; // Updated path check

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Topbar />
                <div className="content">
                    {isDashboardRoot ? (
                        // Default content for the Dashboard path
                        <div className="dashboard-cards">
                            <div
                                className="box new-order"
                                onClick={() => handleNavigation('/dashboard/new-orders')}
                            >
                                New Orders <span className="notification-icon">🔔</span>
                            </div>
                            <div
                                className="box ready-orders"
                                onClick={() => handleNavigation('/dashboard/ready-orders')}
                            >
                                Ready Orders <span className="notification-icon">🔔</span>
                            </div>
                        </div>
                    ) : (
                        // Render child components for other paths
                        <Outlet />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
