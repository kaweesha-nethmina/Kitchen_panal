import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Dashboard.css';

const Dashboard = () => {
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [readyOrdersCount, setReadyOrdersCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const db = getFirestore();

    const isDashboardRoot = location.pathname === "/dashboard";

    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // Fetch new orders count from `pendingOrders` collection
                const pendingOrdersCollection = collection(db, 'pendingOrders');
                const pendingOrdersSnapshot = await getDocs(pendingOrdersCollection);
                setNewOrdersCount(pendingOrdersSnapshot.size);

                // Fetch ready orders count from `readyOrders` collection
                const readyOrdersCollection = collection(db, 'readyOrders');
                const readyOrdersSnapshot = await getDocs(readyOrdersCollection);
                setReadyOrdersCount(readyOrdersSnapshot.size);
            } catch (error) {
                console.error("Error fetching order counts:", error);
            }
        };

        fetchCounts();
    }, [db]);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Topbar />
                <div className="content">
                    {isDashboardRoot ? (
                        <div className="dashboard-cards">
                            <div
                                className="box new-order"
                                onClick={() => handleNavigation('/dashboard/new-orders')}
                            >
                                New Orders <span className="notification-icon">🔔</span>
                                <span className="order-count">{newOrdersCount}</span>
                            </div>
                            <div
                                className="box ready-orders"
                                onClick={() => handleNavigation('/dashboard/ready-orders')}
                            >
                                Ready Orders <span className="notification-icon">🔔</span>
                                <span className="order-count">{readyOrdersCount}</span>
                            </div>
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
