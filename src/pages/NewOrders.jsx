import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, deleteDoc, doc, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./NewReady.css";

const NewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch pending orders from Firestore
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const pendingOrdersCollection = collection(db, "pendingOrders");
        const orderSnapshot = await getDocs(pendingOrdersCollection);
        const orderList = orderSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchPendingOrders();
  }, []);

  // Function to add selected orders to the readyOrders collection and delete them from pendingOrders
  const moveToReadyOrders = async (orderId) => {
    try {
      const orderToMove = orders.find((order) => order.id === orderId);
      if (orderToMove) {
        await addDoc(collection(db, "readyOrders"), {
          ...orderToMove,
          status: "Ready",
        });
        await deleteOrderByOrderId(orderId);
      }
    } catch (error) {
      console.error("Error moving order to readyOrders:", error);
    }
  };

  // Function to delete the document based on the orderId
  const deleteOrderByOrderId = async (orderId) => {
    try {
      const q = query(collection(db, "pendingOrders"), where("orderId", "==", orderId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = doc(db, "pendingOrders", querySnapshot.docs[0].id);
        await deleteDoc(docRef);
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== docRef.id));
      } else {
        console.log("No order found with the specified orderId");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Handle moving selected orders to readyOrders and then deleting them
  const handleDeleteSelectedOrders = async () => {
    try {
      const ordersToMove = selectedOrders.map((orderId) => moveToReadyOrders(orderId));
      await Promise.all(ordersToMove); // Wait for all move operations to complete
      setSelectedOrders([]);
      navigate("/dashboard/ready-orders"); // Navigate to the ready-orders page after completion
    } catch (error) {
      console.error("Error moving selected orders:", error);
    }
  };

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelectedOrders) =>
      prevSelectedOrders.includes(orderId)
        ? prevSelectedOrders.filter((id) => id !== orderId)
        : [...prevSelectedOrders, orderId]
    );
  };

  return (
    <div className="new-orders-container">
      

      <table className="orders-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={() => {
                  setSelectedOrders(
                    selectedOrders.length === orders.length ? [] : orders.map((order) => order.id)
                  );
                }}
                checked={selectedOrders.length === orders.length && orders.length > 0}
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
                <td>{order.id}</td>
                <td>{order.userEmail}</td>
                <td>{order.items.map((item) => item.productName).join(", ")}</td>
                <td>{order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                <td>{order.items.map((item) => item.price).join(", ")}</td>
                <td>{order.totalPrice?.toFixed(2)}</td>
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No new or pending orders found</td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        className="ready-button"
        onClick={handleDeleteSelectedOrders}
        disabled={selectedOrders.length === 0}
      >
        noted
      </button>
    </div>
  );
};

export default NewOrders;
