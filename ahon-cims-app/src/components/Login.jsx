import { useState } from 'react';
import supabase from '../supabaseClient'; // 👈 CRITICAL: Imports your working client
import './Login.css';
import logo from '../assets/img/ac3292eb-74d7-4c0c-8b47-5aec51ab7a48.png';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState(''); // Changed to email state
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // DFD Process 1.0: Authenticate User
      const { error } = await supabase.auth.signInWithPassword({
        email: email, 
        password: password,
      });

      if (error) throw error;

      // Success! Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      alert('Login Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="login-logo" />
        <h4>Ahon Ministries CIMS</h4>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email" // Use type email for Supabase auth
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
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
              placeholder="Enter your password"
            />
          </div>
          {/* Note: Removed the unused 'Role' select input to clean up */}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <p className="signup-text">
            Don't have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
              Sign up now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;