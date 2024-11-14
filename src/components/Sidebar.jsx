import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import logo from "../assets/logo.jpg";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="logo-section">
                <img src={logo} alt="Logo" className="logo" />
                <h2>Biriyani Kade</h2>
                <p>biryanikade@gmail.com</p>
            </div>
            <h3>Kitchen</h3>
            <ul>
                <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? "active-link" : "")}>
                    <li>Dashboard</li>
                </NavLink>
                <NavLink to="/dashboard/new-orders" className={({ isActive }) => (isActive ? "active-link" : "")}>
                    <li>New Orders</li>
                </NavLink>
                <NavLink to="/dashboard/ready-orders" className={({ isActive }) => (isActive ? "active-link" : "")}>
                    <li>Preparing Orders</li>
                </NavLink>
                <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? "active-link" : "")}>
                    <li>Profile</li>
                </NavLink>
            </ul>
        </div>
    );
};

export default Sidebar;
