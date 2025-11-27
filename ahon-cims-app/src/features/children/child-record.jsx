import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import './child-record.css';
import logo from '../../assets/img/ac3292eb-74d7-4c0c-8b47-5aec51ab7a48.png';
import ChildCard from './components/ChildCard';

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

    // additional fields
    address: '',
    housingType: '',
    householdMembers: '',
    schoolName: '',
    gradeLevel: '',
    bloodType: '',
    allergies: '',
    medicalHistory: '',
    assignedCaseworkerId: '',

    // photo placeholder (optional)
    photoFile: null,
  });

  // photo preview states
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoObjectUrl, setPhotoObjectUrl] = useState(null);

  // caseworkers for assign select
  const [caseworkers, setCaseworkers] = useState([]);

  useEffect(() => {
    const loadCaseworkers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email');
        if (error) throw error;
        setCaseworkers(data || []);
      } catch (err) {
        console.warn('Could not load caseworkers', err);
      }
    };
    loadCaseworkers();
  }, []);

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

  const openModal = () => {
    setEditingId(null);
    setForm({
      firstName: '', lastName: '', dob: '', gender: '', sponsorshipId: '',
      enrollmentDate: '', guardianName: '', guardianContact: '',
      emergencyName: '', emergencyPhone: '', sponsorName: '', status: 'Active',
      address: '', housingType: '', householdMembers: '', schoolName: '',
      gradeLevel: '', bloodType: '', allergies: '', medicalHistory: '',
      assignedCaseworkerId: '', photoFile: null,
    });
    if (photoObjectUrl) {
      try { URL.revokeObjectURL(photoObjectUrl); } catch { /* noop */ }
      setPhotoObjectUrl(null);
    }
    setPhotoPreview(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    if (photoObjectUrl) {
      try { URL.revokeObjectURL(photoObjectUrl); } catch { /* noop */ }
      setPhotoObjectUrl(null);
    }
    setPhotoPreview(null);
  };

  const openEdit = (child) => {
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
      address: child.address ?? '',
      housingType: child.housing_type ?? '',
      householdMembers: child.household_members ?? '',
      schoolName: child.school_name ?? '',
      gradeLevel: child.grade_level ?? '',
      bloodType: child.blood_type ?? '',
      allergies: child.allergies ?? '',
      medicalHistory: child.medical_history ?? '',
      assignedCaseworkerId: child.assigned_caseworker_id ?? '',
      photoFile: null,
    });

    if (child.photo_url) {
      if (photoObjectUrl) {
        try { URL.revokeObjectURL(photoObjectUrl); } catch { /* noop */ }
        setPhotoObjectUrl(null);
      }
      setPhotoPreview(child.photo_url);
    } else {
      if (photoObjectUrl) {
        try { URL.revokeObjectURL(photoObjectUrl); } catch { /* noop */ }
        setPhotoObjectUrl(null);
      }
      setPhotoPreview(null);
    }

    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // resilient DB helper: strips unknown columns reported by Supabase and retries
  const attemptDb = async (operation, payloadObj, editingIdLocal, userId) => {
    while (true) {
      let res;
      if (operation === 'update') {
        res = await supabase
          .from('children')
          .update({ ...payloadObj, assigned_caseworker_id: userId })
          .eq('id', editingIdLocal)
          .select()
          .maybeSingle(); // fix: avoid "Cannot coerce the result to a single JSON object"
      } else {
        res = await supabase
          .from('children')
          .insert([{ ...payloadObj, assigned_caseworker_id: userId }])
          .select(); // returns an array
      }

      if (!res.error) return res.data;

      const errMsg = String(res.error.message || res.error);
      const m = errMsg.match(/Could not find the '([^']+)' column/);
      if (m && m[1]) {
        const missingCol = m[1];
        if (missingCol in payloadObj) {
          delete payloadObj[missingCol];
          continue;
        }
      }
      throw res.error;
    }
  };

  const uploadPhotoAndGetUrl = async (file, childIdOrTempKey) => {
    if (!file) return null;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${childIdOrTempKey}-${Date.now()}.${ext}`;

    const { data: uploadRes, error: uploadErr } = await supabase
      .storage
      .from('child-photos')
      .upload(path, file, { upsert: true });

    if (uploadErr) throw uploadErr;

    const { data: publicUrlData } = supabase
      .storage
      .from('child-photos')
      .getPublicUrl(uploadRes.path);

    return publicUrlData?.publicUrl || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Upload photo first (use editingId or a temp key)
      let photoUrl = null;
      if (form.photoFile) {
        const tempKey = editingId ?? (user?.id || 'anon');
        photoUrl = await uploadPhotoAndGetUrl(form.photoFile, tempKey);
      }

      const basePayload = {
        first_name: form.firstName || null,
        last_name: form.lastName || null,
        date_of_birth: form.dob || null,
        gender: form.gender || null,
        sponsorship_id: form.sponsorshipId || null,
        enrollment_date: form.enrollmentDate || null,
        guardian_name: form.guardianName || null,
        guardian_contact: form.guardianContact || null,
        emergency_name: form.emergencyName || null,
        emergency_phone: form.emergencyPhone || null,
        sponsor_name: form.sponsorName || null,
        status: form.status || 'Active',
        address: form.address || null,
        housing_type: form.housingType || null,
        household_members: form.householdMembers ? Number(form.householdMembers) : null,
        school_name: form.schoolName || null,
        grade_level: form.gradeLevel || null,
        blood_type: form.bloodType || null,
        allergies: form.allergies || null,
        medical_history: form.medicalHistory || null,
        assigned_caseworker_id: form.assignedCaseworkerId || user?.id || null,
        ...(photoUrl ? { photo_url: photoUrl } : {}),
      };

      Object.keys(basePayload).forEach(k => {
        if (basePayload[k] === null) delete basePayload[k];
      });

      if (editingId) {
        const updatedData = await attemptDb('update', { ...basePayload }, editingId, user?.id ?? null);
        if (updatedData) {
          setChildrenList(prev => prev.map(c => (c.id === editingId ? updatedData : c)));
        }
        alert('Child updated successfully!');
      } else {
        // Insert to get the new id, then optionally re-upload with id-based name (optional)
        const insertedData = await attemptDb('insert', { ...basePayload }, null, user?.id ?? null);
        const newRecord = Array.isArray(insertedData) ? insertedData[0] : insertedData;
        if (newRecord) setChildrenList(prev => [newRecord, ...prev]);
        alert('Child added successfully!');
      }

      fetchChildren();
      closeModal();
    } catch (err) {
      alert('Error saving child: ' + (err.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] ?? null;

    if (photoObjectUrl) {
      try { URL.revokeObjectURL(photoObjectUrl); } catch { /* noop */ }
      setPhotoObjectUrl(null);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setPhotoObjectUrl(url);
      setForm(prev => ({ ...prev, photoFile: file }));
    } else {
      setPhotoPreview(null);
      setForm(prev => ({ ...prev, photoFile: null }));
    }
  };

  // cleanup when unmounting
  useEffect(() => {
    return () => {
      if (photoObjectUrl) {
        try { URL.revokeObjectURL(photoObjectUrl); } catch { /* noop */ }
      }
    };
  }, [photoObjectUrl]);

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
          <button className="logout-btn" onClick={() => { supabase.auth.signOut(); navigate('/login'); }}>Logout</button>
        </div>
      </header>

      <main className="access-module-container">
        <div className="access-header-row">
          <div className="left-group">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
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
            <button className="add-child-btn" onClick={openModal}><span className="icon">👤</span> Add New Child</button>
          </div>
        </div>

        <div className="children-grid-container">
          {childrenList.length === 0 ? (
            <div className="children-list">
              <p>No children found. Use "Add New Child" to create a record.</p>
            </div>
          ) : (
            <ul className="child-records-list">
              {childrenList.map(child => (
                <ChildCard
                  key={child.id}
                  child={child}
                  onSelect={openEdit}
                />
              ))}
            </ul>
          )}
        </div>

        {isModalOpen && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal wide-modal">
              <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
              <h3 className="modal-title">{editingId ? 'Edit Child Record' : 'Add New Child'}</h3>
              <span className="modal-desc">Enter comprehensive information about the child</span>

              <form className="modal-form" onSubmit={handleSubmit}>
                {/* Photo section */}
                <div className="photo-section">
                  <div className="photo-preview circle" title="User photo preview">
                    {photoPreview ? <img src={photoPreview} alt="Child preview" /> : <div className="placeholder">No photo</div>}
                  </div>
                  <div className="photo-actions">
                    <label className="photo-upload-btn">
                      <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                      <span>Upload Photo</span>
                    </label>
                  </div>
                </div>

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

                <div className="modal-section">
                  <div className="modal-section-title">Contact Information</div>
                  <div className="modal-grid">
                    <label>Parent/Guardian Name *
                      <input name="guardianName" value={form.guardianName} onChange={handleChange} required />
                    </label>
                    <label>Parent/Guardian Contact *
                      <input name="guardianContact" value={form.guardianContact} onChange={handleChange} required />
                    </label>
                    <label>Emergency Contact Name
                      <input name="emergencyName" value={form.emergencyName} onChange={handleChange} />
                    </label>
                    <label>Emergency Contact Phone
                      <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} />
                    </label>
                  </div>
                </div>

                <div className="modal-section">
                  <div className="modal-section-title">Home Details</div>
                  <div className="modal-grid">
                    <label>Address
                      <input name="address" value={form.address} onChange={handleChange} />
                    </label>
                    <label>Housing Type
                      <input name="housingType" value={form.housingType} onChange={handleChange} />
                    </label>
                    <label>Number of Household Members
                      <input name="householdMembers" type="number" value={form.householdMembers} onChange={handleChange} />
                    </label>
                  </div>
                </div>

                <div className="modal-section">
                  <div className="modal-section-title">Education</div>
                  <div className="modal-grid">
                    <label>School Name
                      <input name="schoolName" value={form.schoolName} onChange={handleChange} />
                    </label>
                    <label>Current Grade Level
                      <input name="gradeLevel" value={form.gradeLevel} onChange={handleChange} />
                    </label>
                  </div>
                </div>

                <div className="modal-section">
                  <div className="modal-section-title">Health Information</div>
                  <div className="modal-grid">
                    <label>Blood Type
                      <input name="bloodType" value={form.bloodType} onChange={handleChange} />
                    </label>
                    <label>Known Allergies
                      <input name="allergies" value={form.allergies} onChange={handleChange} />
                    </label>
                    <label>Medical History
                      <input name="medicalHistory" value={form.medicalHistory} onChange={handleChange} />
                    </label>
                  </div>
                </div>

                <div className="modal-section">
                  <div className="modal-section-title">Assignment</div>
                  <div className="modal-grid">
                    <label>Assigned Caseworker *
                      <select name="assignedCaseworkerId" value={form.assignedCaseworkerId} onChange={handleChange} required>
                        <option value="">{/* default uses current user */}</option>
                        {caseworkers.map(cw => <option key={cw.id} value={cw.id}>{cw.full_name || cw.email}</option>)}
                      </select>
                    </label>
                    <label>Sponsor Name (Optional)
                      <input name="sponsorName" value={form.sponsorName} onChange={handleChange} />
                    </label>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : (editingId ? 'Update Record' : 'Add Child')}</button>
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
