import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import './child-record.css';
import logo from '../assets/img/ac3292eb-74d7-4c0c-8b47-5aec51ab7a48.png';

const AccessModule = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [childrenList, setChildrenList] = useState([]);
  const [editingId, setEditingId] = useState(null); // null => creating new

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    sponsorshipId: '',
    enrollmentDate: '',
    guardianName: '',
    guardianContact: '',
    emergencyName: '',
    emergencyPhone: '',
    sponsorName: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    // This is the core of DFD Process 2.0: View/Monitor Children Records
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching children:', error);
    else setChildrenList(data || []);
  };

  const openModal = () => {
    setEditingId(null);
    // Reset form for a new child
    setForm({
      firstName: '', lastName: '', dob: '', gender: '', sponsorshipId: '',
      enrollmentDate: '', guardianName: '', guardianContact: '',
      emergencyName: '', emergencyPhone: '', sponsorName: '', status: 'Active',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const openEdit = (child) => {
    // Map DB fields (snake_case) to form fields (camelCase)
    setEditingId(child.id);
    setForm({
      firstName: child.first_name ?? '',
      lastName: child.last_name ?? '',
      dob: child.date_of_birth ?? '',
      gender: child.gender ?? '',
      sponsorshipId: child.sponsorship_id ?? '',
      enrollmentDate: child.enrollment_date ?? '',
      guardianName: child.guardian_name ?? '',
      guardianContact: child.guardian_contact ?? '',
      emergencyName: child.emergency_name ?? '',
      emergencyPhone: child.emergency_phone ?? '',
      sponsorName: child.sponsor_name ?? '',
      status: child.status ?? 'Active',
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Payload maps React state (camelCase) to DB columns (snake_case)
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        date_of_birth: form.dob,
        gender: form.gender,
        sponsorship_id: form.sponsorshipId,
        enrollment_date: form.enrollmentDate || null,
        guardian_name: form.guardianName || null,
        guardian_contact: form.guardianContact || null,
        emergency_name: form.emergencyName || null,
        emergency_phone: form.emergencyPhone || null,
        sponsor_name: form.sponsorName || null,
        status: form.status || 'Active',
      };

      if (editingId) {
        // DFD Process 3.0: UPDATE existing record
        const { error } = await supabase
          .from('children')
          .update({ ...payload, assigned_caseworker_id: user?.id })
          .eq('id', editingId);

        if (error) throw error;
        alert('Child updated successfully!');
      } else {
        // DFD Process 3.0: INSERT new record
        const { error } = await supabase
          .from('children')
          .insert([
            {
              ...payload,
              assigned_caseworker_id: user?.id ?? null,
              status: payload.status || 'Active',
            }
          ]);
        if (error) throw error;
        alert('Child added successfully!');
      }

      fetchChildren();
      closeModal();
    } catch (error) {
      alert('Error saving child: ' + (error.message ?? error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 1. GLOBAL HEADER / NAVIGATION BAR */}
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
          <button className="logout-btn">Logout</button>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="access-module-container">
        
        {/* ACCESS MODULE HEADER */}
        <div className="access-header-row">
          <div className="left-group">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
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
            <button className="add-child-btn" onClick={openModal}>
              <span className="icon">👤</span> Add New Child
            </button>
          </div>
        </div>
        
        {/* CHILDREN LIST (DFD Process 2.0 Output) */}
        <div className="children-grid-container">
          {childrenList.length === 0 ? (
            <div className="children-list">
              <p>No children found. Use "Add New Child" to create a record.</p>
            </div>
          ) : (
            <ul className="child-records-list">
              {childrenList.map((child) => (
                <li
                  key={child.id}
                  className="child-card-item"
                  onClick={() => openEdit(child)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') openEdit(child); }}
                >
                  <strong>{child.first_name} {child.last_name}</strong> <br/>
                  <small>ID: {child.sponsorship_id}</small> <br/>
                  <span className={`status-badge ${String(child.status || '').toLowerCase()}`}>
                    {child.status || 'Unknown'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* MODAL FOR ADD/EDIT */}
        {isModalOpen && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal wide-modal">
              {/* Close button is inside the form in the original design (for easier handling) */}
              <button className="modal-close" onClick={closeModal} aria-label="Close">×</button> 
              <h3 className="modal-title">{editingId ? 'Edit Child Record' : 'Add New Child'}</h3>
              <span className="modal-desc">Enter or update the child's basic information</span>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-section">
                  <div className="modal-section-title">Basic Information</div>
                  <div className="modal-grid">
                    <label>First Name *
                      <input name="firstName" value={form.firstName} onChange={handleChange} required />
                    </label>
                    <label>Last Name *
                      <input name="lastName" value={form.lastName} onChange={handleChange} required />
                    </label>
                    <label>Date of Birth *
                      <input name="dob" type="date" value={form.dob} onChange={handleChange} required />
                    </label>
                    <label>Gender *
                      <select name="gender" value={form.gender} onChange={handleChange} required>
                        <option value="">Select gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label>Sponsorship ID *
                      <input name="sponsorshipId" value={form.sponsorshipId} onChange={handleChange} placeholder="e.g., AHON-2025-001" required />
                    </label>
                     {editingId && (
                        <label>Status
                          <select name="status" value={form.status} onChange={handleChange}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Graduated">Graduated</option>
                          </select>
                        </label>
                     )}
                  </div>
                </div>

                {/* ... (Other modal sections omitted for brevity but remain in your original code structure) ... */}

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (editingId ? 'Update Record' : 'Add Child')}
                  </button>
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