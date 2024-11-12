import React, { useState } from 'react';
import './NewReady.css';

const NewOrders = () => {
    const orders = [
        {
            orderId: 'OD294415',
            userEmail: 'ovigalathure@gmail.com',
            productName: 'Sea Food Nasigurang',
            quantity: 3,
            price: 1500.00,
            totalPrice: 4500.00,
            timestamp: '11/10/2024, 6:58:14 PM'
        },
        {
            orderId: 'OD243083',
            userEmail: 'th.ja.rangi@gmail.com',
            productName: 'Egg & Vegetable Fried Rice',
            quantity: 2,
            price: 650.00,
            totalPrice: 1300.00,
            timestamp: '10/28/2024, 3:57:23 PM'
        },
        // Add more orders as needed
    ];

    const [selectedOrders, setSelectedOrders] = useState([]);

    const toggleSelectAll = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]); // Deselect all
        } else {
            setSelectedOrders(orders.map(order => order.orderId)); // Select all
        }
    };

    const toggleSelectOrder = (orderId) => {
        setSelectedOrders(prevSelected =>
            prevSelected.includes(orderId)
                ? prevSelected.filter(id => id !== orderId) // Deselect if already selected
                : [...prevSelected, orderId] // Select if not already selected
        );
    };

    const isAllSelected = selectedOrders.length === orders.length;

    return (
        <div className="new-orders-container">
            <h2>New Orders</h2>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th>Order ID</th>
                        <th>User Email</th>
                        <th>Product Name(s)</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total Price</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.includes(order.orderId)}
                                    onChange={() => toggleSelectOrder(order.orderId)}
                                />
                            </td>
                            <td>{order.orderId}</td>
                            <td>{order.userEmail}</td>
                            <td>{order.productName}</td>
                            <td>{order.quantity}</td>
                            <td>{order.price.toFixed(2)}</td>
                            <td>{order.totalPrice.toFixed(2)}</td>
                            <td>{order.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="noted-button">Noted</button>
        </div>
    );
};

export default NewOrders;
