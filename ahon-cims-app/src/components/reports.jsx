import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./report.css";

const Reports = () => {
  const [reportType, setReportType] = useState("Comprehensive Report");
  const [reportPeriod, setReportPeriod] = useState("Quarterly");
  const [modules, setModules] = useState({
    home: true,
    health: true,
    school: true,
    financial: true,
  });

const navigate = useNavigate();


  const handleModuleChange = (e) => {
    setModules({ ...modules, [e.target.name]: e.target.checked });
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
      <main className="reports-container">
        <div className="reports-header">
          <span className="icon reports-icon">📋</span>
          <div>
            <h2>Reports & Analytics</h2>
            <span>Generate comprehensive progress reports</span>
          </div>
           <button className="back-btn" type='button' onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
        <div className="report-box">
          <h3>Generate New Report</h3>
          <span className="report-desc">
            Customize and generate reports based on your needs
          </span>
          <form>
            <div className="report-row">
              <div className="report-field">
                <label>Report Type</label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value)}
                >
                  <option>Comprehensive Report</option>
                  <option>Summary Report</option>
                </select>
              </div>
              <div className="report-field report-field-end">
                <label>Report Period</label>
                <select
                  value={reportPeriod}
                  onChange={e => setReportPeriod(e.target.value)}
                >
                  <option>Quarterly</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </div>
            </div>
            <div className="report-modules-row">
              <div className="report-modules-col">
                <label>
                  <input
                    type="checkbox"
                    name="home"
                    checked={modules.home}
                    onChange={handleModuleChange}
                  />
                  Home Monitoring
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="health"
                    checked={modules.health}
                    onChange={handleModuleChange}
                  />
                  Health Monitoring
                </label>
              </div>
              <div className="report-modules-col">
                <label>
                  <input
                    type="checkbox"
                    name="school"
                    checked={modules.school}
                    onChange={handleModuleChange}
                  />
                  School Monitoring
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="financial"
                    checked={modules.financial}
                    onChange={handleModuleChange}
                  />
                  Financial Monitoring
                </label>
              </div>
            </div>
            <button className="generate-btn" type="submit">
              <span className="icon">📋</span> Generate Report
            </button>
          </form>
        </div>
        <div className="recent-reports-box">
          <h4 className="recent-reports-title">Recent Reports</h4>
          <span className="recent-reports-desc">Previously generated reports</span>
          <div className="recent-report-list">
            <div className="recent-report-item">
              <div>
                <div className="recent-report-name">Q3 2025 Comprehensive Report</div>
                <div className="recent-report-meta">2025-10-01 • Comprehensive</div>
              </div>
              <div className="recent-report-actions">
                <button className="view-btn"><span role="img" aria-label="view">👁️</span> View</button>
                <button className="download-btn"><span role="img" aria-label="download">⬇️</span> Download</button>
              </div>
            </div>
            <div className="recent-report-item">
              <div>
                <div className="recent-report-name">Health Monitoring Summary - September</div>
                <div className="recent-report-meta">2025-09-30 • Health</div>
              </div>
              <div className="recent-report-actions">
                <button className="view-btn"><span role="img" aria-label="view">👁️</span> View</button>
                <button className="download-btn"><span role="img" aria-label="download">⬇️</span> Download</button>
              </div>
            </div>
            <div className="recent-report-item">
              <div>
                <div className="recent-report-name">Financial Report - Q2 2025</div>
                <div className="recent-report-meta">2025-07-01 • Financial</div>
              </div>
              <div className="recent-report-actions">
                <button className="view-btn"><span role="img" aria-label="view">👁️</span> View</button>
                <button className="download-btn"><span role="img" aria-label="download">⬇️</span> Download</button>
              </div>
            </div>
          </div>
        </div>
        <div className="report-templates-box">
          <h3 className="report-templates-title">Report Templates</h3>
          <span className="report-templates-desc">
            Use these templates for quick report generation
          </span>
          <div className="report-templates-list">
            <div className="report-template-card">
              <div>
                <div className="report-template-name">Comprehensive Report Template</div>
                <div className="report-template-meta">For in-depth analysis</div>
              </div>
              <button className="template-btn">
                <span className="icon">📥</span> Use Template
              </button>
            </div>
            <div className="report-template-card">
              <div>
                <div className="report-template-name">Summary Report Template</div>
                <div className="report-template-meta">For quick overviews</div>
              </div>
              <button className="template-btn">
                <span className="icon">📥</span> Use Template
              </button>
            </div>
            <div className="report-template-card">
              <div>
                <div className="report-template-name">Health Report Template</div>
                <div className="report-template-meta">Focused on health metrics</div>
              </div>
              <button className="template-btn">
                <span className="icon">📥</span> Use Template
              </button>
            </div>
            <div className="report-template-card">
              <div>
                <div className="report-template-name">Financial Report Template</div>
                <div className="report-template-meta">Detailed financial analysis</div>
              </div>
              <button className="template-btn">
                <span className="icon">📥</span> Use Template
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;