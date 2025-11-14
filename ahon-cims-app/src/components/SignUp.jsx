import { useState } from 'react';
import './SignUp.css';
import logo from '../assets/img/ac3292eb-74d7-4c0c-8b47-5aec51ab7a48.png';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');   
  const [role, setRole] = useState('Staff Caseworker');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add sign up logic here
    alert(`Sign Up\nFullname: ${fullname}\nEmail: ${email}\nRole: ${role}`);
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
          <button type="submit" className="login-btn">Sign Up</button>
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