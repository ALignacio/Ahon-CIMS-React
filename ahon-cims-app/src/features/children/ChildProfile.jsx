import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import logo from '../../assets/img/ac3292eb-74d7-4c0c-8b47-5aec51ab7a48.png';
import './ChildProfile.css';
import { getAge, formatDate } from './utils';

export default function ChildProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChild = async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        console.error('Child not found', error);
        navigate('/child-records');
        return;
      }
      setChild(data);
      setLoading(false);
    };

    loadChild();
  }, [id, navigate]);

  if (loading || !child) return null;

  const fullName = `${child.first_name || ''} ${child.last_name || ''}`.trim();

  return (
    <div className="child-profile-root">
      {/* Top app header (same style as dashboard/child-records) */}
      <header className="dashboard-header">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <div>
            <h2>Ahon Ministries CIMS</h2>
            <span>Child Information Management System</span>
          </div>
        </div>

        <div className="user-section">
          {/* You can later plug in real user name/role here */}
          <span>👤 Case Worker</span>
          <span>Staff Caseworker</span>
          <button
            className="logout-btn"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="child-profile-container">
        {/* Back button */}
        <div className="child-profile-top-bar">
          <button
            className="cp-back-btn"
            onClick={() => navigate('/child-records')}
          >
            ← Back to Child Records
          </button>

          <button
            className="cp-export-btn"
            type="button"
            onClick={() => window.print()} // placeholder for “Export as PDF”
          >
            Export Profile as PDF
          </button>
        </div>

        {/* Header card */}
        <section className="cp-header-card">
          <div className="cp-header-left">
            <div className="cp-avatar-wrap">
              {child.photo_url ? (
                <img src={child.photo_url} alt={fullName} />
              ) : (
                <div className="cp-avatar-placeholder">👤</div>
              )}
            </div>

            <div className="cp-header-main">
              <h2>{fullName || 'Unnamed Child'}</h2>
              <div className="cp-header-meta">
                <span>{child.gender || '—'}</span>
                <span>• Age: {child.date_of_birth ? getAge(child.date_of_birth) : '—'}</span>
                <span>• ID: {child.sponsorship_id || '—'}</span>
              </div>

              <div className="cp-header-submeta">
                <div>
                  <span className="cp-label">Date of Birth</span>
                  <span>{formatDate(child.date_of_birth)}</span>
                </div>
                <div>
                  <span className="cp-label">Enrollment Date</span>
                  <span>{formatDate(child.enrollment_date)}</span>
                </div>
                <div>
                  <span className="cp-label">Sponsor</span>
                  <span>{child.sponsor_name || '—'}</span>
                </div>
                <div>
                  <span className="cp-label">Assigned Caseworker</span>
                  <span>{child.assigned_caseworker_id || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cp-header-right">
            <span className={`cp-status-badge ${String(child.status || 'active').toLowerCase()}`}>
              {(child.status || 'Active').toLowerCase()}
            </span>

            <button
              type="button"
              className="cp-edit-btn"
              onClick={() => navigate('/child-records')} // or open edit modal in future
            >
              ✏️ Edit Profile
            </button>
          </div>
        </section>

        {/* Tabs (non-interactive placeholder) */}
        <nav className="cp-tabs">
          <button className="cp-tab active">Basic Info</button>
          <button className="cp-tab">Home</button>
          <button className="cp-tab">Education</button>
          <button className="cp-tab">Health</button>
          <button className="cp-tab">Development</button>
        </nav>

        {/* Basic Info content */}
        <section className="cp-section-card">
          <h3>Contact Information</h3>
          <div className="cp-two-column">
            <div>
              <div className="cp-field">
                <span className="cp-label">Parent/Guardian Name</span>
                <span>{child.guardian_name || '—'}</span>
              </div>
              <div className="cp-field">
                <span className="cp-label">Parent/Guardian Contact</span>
                <span>{child.guardian_contact || '—'}</span>
              </div>
              <div className="cp-field">
                <span className="cp-label">Address</span>
                <span>{child.address || '—'}</span>
              </div>
            </div>

            <div>
              <div className="cp-field">
                <span className="cp-label">Emergency Contact Name</span>
                <span>{child.emergency_name || '—'}</span>
              </div>
              <div className="cp-field">
                <span className="cp-label">Emergency Contact Phone</span>
                <span>{child.emergency_phone || '—'}</span>
              </div>
              <div className="cp-field">
                <span className="cp-label">Housing Type</span>
                <span>{child.housing_type || '—'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Monitoring modules (static buttons for now) */}
        <section className="cp-section-card">
          <h3>Monitoring Modules</h3>
          <div className="cp-modules-grid">
            <div className="cp-module-card">
              <div className="cp-module-icon">🏠</div>
              <div className="cp-module-title">Home Monitoring</div>
              <div className="cp-module-desc">
                Living conditions and family environment
              </div>
            </div>
            <div className="cp-module-card">
              <div className="cp-module-icon">🎓</div>
              <div className="cp-module-title">School Monitoring</div>
              <div className="cp-module-desc">
                Academic grades and attendance
              </div>
            </div>
            <div className="cp-module-card">
              <div className="cp-module-icon">❤️</div>
              <div className="cp-module-title">Health Monitoring</div>
              <div className="cp-module-desc">
                Medical history and immunizations
              </div>
            </div>
            <div className="cp-module-card">
              <div className="cp-module-icon">💰</div>
              <div className="cp-module-title">Financial Monitoring</div>
              <div className="cp-module-desc">
                Funds and expenses tracking
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}