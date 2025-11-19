import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './child-record.css';

const AccessModule = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    dob: '',
    gender: '',
    notes: ''
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ name: '', dob: '', gender: '', notes: '' });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send `form` to API / state
    console.log('New child:', form);
    closeModal();
  };

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
          <div className="left-group">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
            <div className="access-title">
              <h3>Child Records</h3>
              <span>Your assigned children</span>
            </div>
          </div>
          <button className="add-child-btn" onClick={openModal}>
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

        {isModalOpen && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal wide-modal">
              <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
              <h3 className="modal-title">Add New Child</h3>
              <span className="modal-desc">Enter the child's basic information to create a new record</span>
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-section">
                  <div className="modal-section-title">Basic Information</div>
                  <div className="modal-grid">
                    <label>
                      First Name *
                      <input name="firstName" required />
                    </label>
                    <label>
                      Last Name *
                      <input name="lastName" required />
                    </label>
                    <label>
                      Date of Birth *
                      <input name="dob" type="date" required />
                    </label>
                    <label>
                      Gender *
                      <select name="gender" required>
                        <option value="">Select gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label>
                      Sponsorship ID *
                      <input name="sponsorshipId" placeholder="e.g., AHON-2025-001" required />
                    </label>
                    <label>
                      Enrollment Date
                      <input name="enrollmentDate" type="date" />
                    </label>
                  </div>
                </div>
                <div className="modal-section">
                  <div className="modal-section-title">Contact Information</div>
                  <div className="modal-grid">
                    <label>
                      Parent/Guardian Name *
                      <input name="guardianName" required />
                    </label>
                    <label>
                      Parent/Guardian Contact *
                      <input name="guardianContact" required />
                    </label>
                    <label>
                      Emergency Contact Name
                      <input name="emergencyName" />
                    </label>
                    <label>
                      Emergency Contact Phone
                      <input name="emergencyPhone" />
                    </label>
                  </div>
                </div>
                <div className="modal-section">
                  <div className="modal-section-title">Sponsorship Information</div>
                  <label>
                    Sponsor Name (Optional)
                    <input name="sponsorName" placeholder="Enter sponsor's name if assigned" />
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">Add Child</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AccessModule;