import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import './NewReady.css';

const ReadyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);

    useEffect(() => {
        const fetchReadyOrders = async () => {
            try {
                const readyOrdersCollection = collection(db, "readyOrders");
                const orderSnapshot = await getDocs(readyOrdersCollection);
                const orderList = orderSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setOrders(orderList);
            } catch (error) {
                console.error("Error fetching ready orders:", error);
            }
        };

        fetchReadyOrders();
    }, []);

    const toggleSelectAll = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]); // Deselect all
        } else {
            setSelectedOrders(orders.map(order => order.id)); // Select all
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

    // Handle submitting and moving orders to the appropriate collection
    const handleReady = async () => {
        try {
            const ordersToProcess = orders.filter(order => selectedOrders.includes(order.id));

            await Promise.all(
                ordersToProcess.map(async (order) => {
                    const targetCollection = order.deliveryOption === "Delivery" ? "delivery" : "takeAway";

                    // Add to the respective collection
                    await addDoc(collection(db, targetCollection), {
                        ...order,
                        timestamp: new Date(),
                    });

                    // Delete from readyOrders collection using query to locate the exact document
                    const orderQuery = query(collection(db, "readyOrders"), where("orderId", "==", order.orderId));
                    const querySnapshot = await getDocs(orderQuery);

                    querySnapshot.forEach(async (doc) => {
                        await deleteDoc(doc.ref);
                    });
                })
            );

            // Update local state to reflect removed orders
            setOrders(prevOrders => prevOrders.filter(order => !selectedOrders.includes(order.id)));
            setSelectedOrders([]); // Clear selected orders
        } catch (error) {
            console.error("Error processing ready orders:", error);
        }
    };

    return (
        <div className="ready-orders-container">
            <h2>Preparing Orders</h2>
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
                        <th>Delivery Option</th>
                        <th>Timestamp</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.includes(order.id)}
                                        onChange={() => toggleSelectOrder(order.id)}
                                    />
                                </td>
                                <td>{order.orderId}</td>
                                <td>{order.userEmail}</td>
                                <td>{order.items.map(item => item.productName).join(", ")}</td>
                                <td>{order.items.reduce((total, item) => total + (item.quantity || 0), 0)}</td>
                                <td>{order.items.map(item => 
                                    (typeof item.price === 'number' ? item.price.toFixed(2) : item.price)
                                ).join(", ")}</td>
                                <td>{order.totalPrice ? order.totalPrice.toFixed(2) : "N/A"}</td>
                                <td>{order.deliveryOption || "N/A"}</td>
                                <td>
                                    {order.timestamp ? (
                                        <>
                                            {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}{" "}
                                            {new Date(order.timestamp.seconds * 1000).toLocaleTimeString()}
                                        </>
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                <td>{order.status || "Pending"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11">No ready orders found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button className="ready-button" onClick={handleReady} disabled={selectedOrders.length === 0}>
                Ready
            </button>
        </div>
    );
};

export default ReadyOrders;
