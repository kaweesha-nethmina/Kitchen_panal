import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import "./NewReady.css";

const NewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

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

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelectedOrders) =>
      prevSelectedOrders.includes(orderId)
        ? prevSelectedOrders.filter((id) => id !== orderId)
        : [...prevSelectedOrders, orderId]
    );
  };

  const handleNoted = async () => {
    try {
      for (const orderId of selectedOrders) {
        const order = orders.find((order) => order.id === orderId);

        if (!order) {
          console.error(`Order with ID ${orderId} not found in state.`);
          continue;
        }

        // Add to `readyOrders` collection
        await addDoc(collection(db, "readyOrders"), {
          ...order,
          timestamp: Timestamp.fromDate(new Date()),
          status: "Ready",
        });

        // Send a notification based on `deliveryOption`
        if (order.deliveryOption === "Take Away") {
          await addDoc(collection(db, "notifications"), {
            userEmail: order.userEmail,
            message: `Your order with ID: ${orderId} is ready. Hurry to pick it up!`,
            orderId: orderId,
            timestamp: Timestamp.fromDate(new Date()),
            read: false,
          });
        } else if (order.deliveryOption === "Delivery") {
          console.log(`Delivery will be scheduled later for order ID: ${orderId}`);
        }

        // Attempt to remove from `pendingOrders`
        const orderDocRef = doc(db, "pendingOrders", orderId);
        console.log("Deleting from pendingOrders:", orderDocRef.path);
        await deleteDoc(orderDocRef);
        console.log(`Order with ID ${orderId} removed from pendingOrders.`);
      }

      // Update state to remove confirmed orders from the displayed list
      setOrders((prevOrders) => prevOrders.filter((order) => !selectedOrders.includes(order.id)));
      setSelectedOrders([]); // Clear selected orders after confirming

      console.log("Orders have been moved to readyOrders and notifications sent.");
    } catch (error) {
      console.error("Error updating ready orders or deleting from pendingOrders:", error);
    }
  };

  return (
    <div className="new-orders-container">
      <h2>New & Pending Orders</h2>
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
                <td>{order.orderId}</td>
                <td>{order.userEmail}</td>
                <td>{order.items.map((item) => item.productName).join(", ")}</td>
                <td>
                  {order.items.reduce((total, item) => total + item.quantity, 0)}
                </td>
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
        onClick={handleNoted}
        disabled={selectedOrders.length === 0}
      >
        Ready
      </button>
    </div>
  );
};

export default NewOrders;
