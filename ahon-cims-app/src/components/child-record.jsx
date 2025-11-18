import React from 'react';
import { useNavigate } from 'react-router-dom';
import './child-record.css';

const AccessModule = () => {
  const navigate = useNavigate();

  return (
    <div>
      <header className="dashboard-header">
        <div className="logo-section">
          <img src="/src/assets/img/ac3292eb-74d7-4c0c-8b47-5aec51ab7a48.png" alt="Logo" className="dashboard-logo" />
          <div>
            <h2>Ahon Ministries CIMS</h2>
            <span>Child Information Management System</span>
          </div>
        </div>
        <div className="user-section">
          <span>👤 Case Worker</span>
          <span>Staff Caseworker</span>
          <button className="logout-btn">Logout</button>
        </div>
      </header>
      <main className="access-module-container">
        <div className="access-header-row">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <div className="access-title">
            <h3>Child Records</h3>
            <span>Your assigned children</span>
          </div>
          <button className="add-child-btn">
            <span className="icon">👤</span> Add New Child
          </button>
        </div>
        <div className="search-box">
          <span className="icon">🔍</span>
          <input type="text" placeholder="Search by child name..." />
        </div>
        <div className="children-list">
          <span>No children found matching your search.</span>
        </div>
      </main>
    </div>
  );
};

export default AccessModule;