import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './Topbar.css';

const Topbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('Guest');
    const [profileImage, setProfileImage] = useState('default-profile.png');
    const db = getFirestore();

    useEffect(() => {
        const fetchUserData = async () => {
            const sessionData = JSON.parse(sessionStorage.getItem('user'));
            if (sessionData && sessionData.email) {
                const userEmail = sessionData.email;

                try {
                    const staffRef = collection(db, 'staff');
                    const q = query(staffRef, where('email', '==', userEmail));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        setUserName(userData.name || 'Guest');
                        setProfileImage(userData.profileImage || 'default-profile.png');
                    }
                } catch (error) {
                    console.error('Error fetching user data from Firestore:', error);
                }
            }
        };

        fetchUserData();
    }, [db]);

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard':
                return 'Dashboard';
            case '/dashboard/new-orders':
                return 'New Orders';
            case '/dashboard/ready-orders':
                return 'Preparing Orders';
            case '/dashboard/profile':
                return 'Profile';
            default:
                return 'Dashboard';
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="topbar">
            <h1>{getPageTitle()}</h1>
            <div className="topbar-right">
                {profileImage ? (
                    <img src={profileImage} alt="Profile" className="profile-photo" />
                ) : (
                    <div className="profile-placeholder">
                        <span>{userName ? userName[0].toUpperCase() : '?'}</span>
                    </div>
                )}
                <span>{`Welcome, ${userName}`}</span>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default Topbar;
