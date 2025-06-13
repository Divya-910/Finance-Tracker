import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Make sure this is imported
import Navbar from './Navbar';
const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg]         = useState('');
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, { displayName: username });
      await sendEmailVerification(userCredential.user);
      setMsg("Verification email sent! Please check your inbox.");
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="signup-page">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          /><br /><br />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br /><br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br /><br />

          <button type="submit">Sign Up</button>
        </form>

        {msg && <p className="msg">{msg}</p>}
        {error && <p className="error">{error}</p>}

        {/* Back to Login button */}
        <button
          className="back-button"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>
      </div>
    </div>
    </>
  );
};

export default Signup;
