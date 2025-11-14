import { useState } from 'react';
import './Login.css';
import logo from '../assets/img/ac3292eb-74d7-4c0c-8b47-5aec51ab7a48.png';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Staff Caseworker');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // ...login logic...
    const loginSuccess = username === 'admin' && password === 'password';
    if (loginSuccess) {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="login-logo" />
        <h4>Ahon Ministries CIMS</h4>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Staff Caseworker">Staff Caseworker</option>
              <option value="Project Director">Project Director</option>
            </select>
          </div>
          <button type="submit" className="login-btn">Login</button>
          <p className="signup-text">
            Don't have an account?{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                navigate('/signup');
              }}
            >
              Sign up now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;