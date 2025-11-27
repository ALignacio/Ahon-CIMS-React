import React, { useState, useEffect } from 'react';
import './dashboard.css';
import logo from '../assets/img/ac3292eb-74d7-4c0c-8b47-5aec51ab7a48.png';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // get initial user
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data?.user ?? null);
    };
    loadUser();

    // subscribe to auth changes (keeps UI in sync)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      // cleanup subscription
      subscription?.subscription?.unsubscribe?.();
      // for older/newer SDK shapes, try both
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login'); // adjust route if your login route is different
  };

  // Display name preference: full_name (metadata) -> email -> id
  const displayName =
    currentUser?.user_metadata?.full_name ||
    currentUser?.email ||
    currentUser?.id ||
    'Guest';

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
          <span>👤 {displayName}</span>
          <span>{currentUser?.user_metadata?.role ?? 'Staff Caseworker'}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-container">
        <h3>Welcome back, {displayName}</h3>
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
            <span className="module-title">
              <span className="icon">👥</span>
              <span>Child Records</span>
            </span>
            <p>View and manage sponsored children profiles</p>
            <button className="access-btn" onClick={() => navigate('/child-records')}>
              Access Module
            </button>
          </div>
          <div className="module-card">
            <span className="module-title">
              <span className="icon">📄</span>
              <span>Reports</span>
            </span>
            <p>Generate comprehensive progress reports</p>
            <button className="access-btn" onClick={() => navigate('/reports')}>
              Access Module
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <h4>Recent Activity</h4>
        <div className="recent-activity">
          <span><b> Latest updates and changes in the system </b></span>
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