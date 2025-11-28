import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import './child-record.css';
import logo from '../../assets/img/ac3292eb-74d7-4c0c-8b47-5aec51ab7a48.png';
import ChildCard from './components/ChildCard';

const AccessModule = () => {
  const navigate = useNavigate();
  const [childrenList, setChildrenList] = useState([]);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setChildrenList(data || []);
    } catch (err) {
      console.error('Error fetching children:', err);
    }
  };

  const openEdit = (child) => {
    // optional: keep this if clicking the card should still open edit UI later
    // for now, just navigate to profile using id
    navigate(`/child-records/${child.id}`);
  };

  return (
    <div>
      <header className="dashboard-header">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <div>
            <h2>Ahon Ministries CIMS</h2>
            <span>Child Information Management System</span>
          </div>
        </div>
        <div className="user-section">
          <span>👤 Case Worker</span>
          <span>Staff Caseworker</span>
          <button
            className="logout-btn"
            onClick={() => {
              supabase.auth.signOut();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="access-module-container">
        <div className="access-header-row">
          <div className="left-group">
            <button
              className="back-btn"
              onClick={() => navigate('/dashboard')}
            >
              ← Back to Dashboard
            </button>
            <div className="access-title">
              <h3>Child Records</h3>
              <span>Your assigned children</span>
            </div>
          </div>

          <div className="right-group">
            <div className="search-box">
              <span className="icon">🔍</span>
              <input type="text" placeholder="Search by child name..." />
            </div>
            <button
              className="add-child-btn"
              onClick={() => navigate('/child-records/new')}
            >
              <span className="icon">👤</span> Add New Child
            </button>
          </div>
        </div>

        <div className="children-grid-container">
          {childrenList.length === 0 ? (
            <div className="children-list">
              <p>No children found. Use "Add New Child" to create a record.</p>
            </div>
          ) : (
            <ul className="child-records-list">
              {childrenList.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  onSelect={openEdit}
                />
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default AccessModule;
