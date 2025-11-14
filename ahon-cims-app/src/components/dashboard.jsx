import React from 'react';
import './dashboard.css';
import logo from '../assets/img/ac3292eb-74d7-4c0c-8b47-5aec51ab7a48.png';
const Dashboard = () => {
  return (
    <div>
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <div>
            <h2>Ahon Ministries CIMS</h2>
            <span>Child Information Management System</span>
          </div>
        </div>
        <div className="user-section">
          <span>👤 312312312</span>
          <span>Staff Caseworker</span>
          <button className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-container">
        <h3>Welcome back, 312312312</h3>
        <p>Manage your assigned children and update their records</p>

        {/* Summary Cards */}
        <div className="dashboard-summary">
          <div className="summary-card">
            <span>Total Children</span>
            <span>3</span>
            <span className="icon">👥</span>
          </div>
          <div className="summary-card">
            <span>Active Cases</span>
            <span>3</span>
            <span className="icon">📈</span>
          </div>
          <div className="summary-card">
            <span>Pending Updates</span>
            <span>3</span>
            <span className="icon">⚠️</span>
          </div>
          <div className="summary-card">
            <span>Recent Activities</span>
            <span>1</span>
            <span className="icon">📋</span>
          </div>
        </div>

        {/* System Modules */}
        <h4>System Modules</h4>
        <div className="dashboard-modules">
          <div className="module-card">
            <span>👥 Child Records</span>
            <p>View and manage sponsored children profiles</p>
            <button className="access-btn">Access Module</button>
          </div>
          <div className="module-card">
            <span>📄 Reports</span>
            <p>Generate comprehensive progress reports</p>
            <button className="access-btn">Access Module</button>
          </div>
        </div>

        {/* Recent Activity */}
        <h4>Recent Activity</h4>
        <div className="recent-activity">
          <div className="activity-card">
            <span>New child profile added: Maria Santos</span>
            <span>2 hours ago • by System</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;