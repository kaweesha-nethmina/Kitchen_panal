import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [inputError, setInputError] = useState({ email: false, password: false });
    const navigate = useNavigate();
    const db = getFirestore();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Fetch staff collection
            const staffCollection = collection(db, 'staff');
            const staffSnapshot = await getDocs(staffCollection);
            const staffList = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Filter for kitchen section
            const kitchenStaff = staffList.filter(staff => staff.section === 'kitchen');

            // Check if the user exists and validate password
            const user = kitchenStaff.find(staff => staff.email === email);

            if (user) {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (isPasswordValid) {
                    // Store user data in sessionStorage
                    sessionStorage.setItem('user', JSON.stringify({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        section: user.section,
                    }));

                    navigate('/dashboard'); // Navigate directly
                } else {
                    // Invalid password
                    setErrorMessage('Username or password is not correct');
                    setInputError({ email: true, password: true });
                }
            } else {
                // Invalid email
                setErrorMessage('Username or password is not correct');
                setInputError({ email: true, password: true });
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Kitchen Login</h2>
                <form onSubmit={handleLogin}>
                    <div className={`input-group ${inputError.email ? 'error' : ''}`}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setInputError({ ...inputError, email: false });
                            }}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className={`input-group ${inputError.password ? 'error' : ''}`}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setInputError({ ...inputError, password: false });
                            }}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Remember Me
                        </label>
                        <a href="#" className="forgot-password">Forgot Password?</a>
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
