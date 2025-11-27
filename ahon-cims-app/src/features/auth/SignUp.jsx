import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import './SignUp.css';
import logo from '../../assets/img/ac3292eb-74d7-4c0c-8b47-5aec51ab7a48.png';

function SignUp() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');   
  const [role, setRole] = useState('Staff Caseworker');
  const [loading, setLoading] = useState(false); // 👈 Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic Validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // 2. Call Supabase Sign Up
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullname, // 👈 Stores name in user_metadata
            role: role,          // 👈 Stores role in user_metadata
          },
        },
      });

      if (error) throw error;

      // 3. Handle Success
      alert('Registration Successful! Please check your email to verify your account.');
      navigate('/'); // Redirect to Login page

    } catch (error) {
      alert('Sign Up Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
         <img src={logo} alt="Logo" className="signup-logo" />
        <h4>Create an account</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-fullname">Fullname</label>
            <input
              type="text"
              id="signup-fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              placeholder="Juan Dela Cruz"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="juan@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6} // Supabase requires min 6 chars by default
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-confirm-password">Confirm password</label>
            <input
              type="password"
              id="signup-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-role">Role</label>
            <select
              id="signup-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Staff Caseworker">Staff Caseworker</option>
              <option value="Project Director">Project Director</option>
            </select>
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          <p className="signup-text">
            Already have an account?{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                navigate('/');
              }}
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;