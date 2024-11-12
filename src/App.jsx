import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import NewOrders from './pages/NewOrders';
import ReadyOrders from './pages/ReadyOrders';
// import OrderList from './pages/OrderList'; // Ensure you have this component created
import Profile from './pages/Profile'; // Ensure you have this component created

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />}>
                        {/* Updated child routes */}
                        {/* <Route index element={<OrderList />} /> */}
                        <Route path="new-orders" element={<NewOrders />} />
                        <Route path="ready-orders" element={<ReadyOrders />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
