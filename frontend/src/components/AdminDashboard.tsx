"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { Users, GraduationCap, Upload, Shield, Award, Activity, Layers, UserPlus, PlusCircle, TrendingUp, X } from "lucide-react";

interface AdminDashboardProps {
  onOpenBulkUpload: () => void;
  onNavigateDataGrid: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenBulkUpload,
  onNavigateDataGrid,
}) => {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Announcement modal state
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annPriority, setAnnPriority] = useState("Normal");
  const [annBatch, setAnnBatch] = useState("All Batches");
  const [postingAnn, setPostingAnn] = useState(false);

  // Add Single Student CRUD Modal state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sRoll, setSRoll] = useState("");
  const [sBatch, setSBatch] = useState("2nd Year AI & DS Batch");
  const [sDept, setSDept] = useState("B.TECH AI & DS");
  const [sStatus, setSStatus] = useState("Unplaced");
  const [sCompany, setSCompany] = useState("");
  const [sPackage, setSPackage] = useState("0");
  const [sSkills, setSSkills] = useState("");
  const [sAttendance, setSAttendance] = useState("90");
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [studentError, setStudentError] = useState("");

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sumRes, logRes] = await Promise.all([
        fetch(`${API_BASE}/analytics/summary`),
        fetch(`${API_BASE}/audit-logs?limit=15`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (sumRes.ok) {
        const sData = await sumRes.json();
        setSummary(sData);
      }
      if (logRes.ok) {
        const lData = await logRes.json();
        setAuditLogs(lData);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostingAnn(true);
    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: annTitle,
          content: annContent,
          priority: annPriority,
          target_batch: annBatch,
        }),
      });

      if (res.ok) {
        setShowAnnModal(false);
        setAnnTitle("");
        setAnnContent("");
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error posting announcement:", err);
    } finally {
      setPostingAnn(false);
    }
  };

  const handleCreateStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingStudent(true);
    setStudentError("");

    try {
      const skillsArr = sSkills.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: sName,
          email: sEmail,
          roll_number: sRoll,
          batch: sBatch,
          department: sDept,
          placement_status: sStatus,
          company_name: sCompany || null,
          package_lpa: parseFloat(sPackage) || 0.0,
          skills: skillsArr,
          attendance_pct: parseFloat(sAttendance) || 90.0,
        }),
      });

      if (res.ok) {
        setShowAddStudentModal(false);
        setSName("");
        setSEmail("");
        setSRoll("");
        setSCompany("");
        setSPackage("0");
        setSSkills("");
        fetchAdminData();
      } else {
        const errData = await res.json();
        setStudentError(errData.detail || "Failed to create student.");
      }
    } catch (err) {
      setStudentError("Network error while adding student.");
    } finally {
      setCreatingStudent(false);
    }
  };

  const overview = summary?.overview || {};
  const placement = summary?.placement_stats || {};
  const batchMetrics = summary?.batch_metrics || [];

  return (
    <div className="space-y-6">
      {/* Top Banner Hero Card */}
      <div className="bg-[#0f172a] text-white rounded-xl p-6 sm:p-7 shadow-xs border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
            <Shield className="w-3.5 h-3.5" /> Executive Admin Operations
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Welcome, {user?.full_name}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            School of Innovation • Artificial Intelligence & Data Science Vertical Dashboard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="btn-primary text-xs gap-1.5 shadow-xs font-semibold"
          >
            <UserPlus className="w-4 h-4" /> Add Single Student
          </button>

          <button
            onClick={onOpenBulkUpload}
            className="btn-secondary text-xs gap-1.5 shadow-xs font-semibold"
          >
            <Upload className="w-4 h-4 text-blue-600" /> Bulk CSV Import
          </button>

          <button
            onClick={() => setShowAnnModal(true)}
            className="btn-secondary text-xs gap-1.5 shadow-xs font-semibold"
          >
            <PlusCircle className="w-4 h-4 text-amber-600" /> Post Notice
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="ent-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{overview.total_students || 0}</div>
          <div className="text-xs text-slate-500">Across 3 academic batches</div>
        </div>

        <div className="ent-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Placed Students</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-700">{placement.placed_count || 0}</div>
          <div className="text-xs text-slate-500">Highest Package: <strong className="text-slate-800">{placement.highest_package_lpa || 0} LPA</strong></div>
        </div>

        <div className="ent-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified Models</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-700">{overview.total_projects || 0}</div>
          <div className="text-xs text-slate-500">AI/DS Prototypes Logged</div>
        </div>

        <div className="ent-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Package</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-amber-700">{placement.avg_package_lpa || 0} LPA</div>
          <div className="text-xs text-slate-500">Tier 1 Companies: <strong className="text-slate-800">{placement.tier1_count || 0}</strong></div>
        </div>
      </div>

      {/* Batch Performance Matrix */}
      <div className="ent-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-sm flex items-center justify-between">
          <span>Batch Wise Performance Matrix</span>
          <button
            onClick={onNavigateDataGrid}
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            Open Full Student Directory →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="ent-table">
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Total Students</th>
                <th>Active Lab Users</th>
                <th>Placed Count</th>
                <th>Avg Attendance</th>
              </tr>
            </thead>
            <tbody>
              {batchMetrics.map((b: any) => (
                <tr key={b.batch_name}>
                  <td className="font-bold text-slate-900">{b.batch_name}</td>
                  <td className="font-semibold text-slate-800">{b.total_students}</td>
                  <td className="font-semibold text-blue-700">{b.active_lab_users}</td>
                  <td className="font-bold text-emerald-700">{b.placed_students}</td>
                  <td className="font-semibold text-slate-700">{b.avg_attendance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Stream */}
      <div className="ent-card p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
          <Activity className="w-4 h-4 text-blue-600" /> System Audit & User Activity Stream
        </h3>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No recent activity logged.</p>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs">
                <div className="space-x-2">
                  <span className="font-bold text-slate-900">{log.user_email}</span>
                  <span className="text-slate-600 font-medium">({log.action})</span>
                  <span className="text-slate-500 font-mono text-[11px]">{log.details}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD SINGLE STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" /> Create New Student Record
              </h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudentSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={sRoll}
                    onChange={(e) => setSRoll(e.target.value)}
                    placeholder="e.g. 23AIA09"
                    className="ent-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={sName}
                    onChange={(e) => setSName(e.target.value)}
                    placeholder="e.g. Anushwathi R"
                    className="ent-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={sEmail}
                  onChange={(e) => setSEmail(e.target.value)}
                  placeholder="e.g. 23aia09anushwathi@soi.kgkite.ac.in"
                  className="ent-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Academic Batch</label>
                  <select
                    value={sBatch}
                    onChange={(e) => setSBatch(e.target.value)}
                    className="ent-input"
                  >
                    <option value="SOI Placement Batch">SOI Placement Batch</option>
                    <option value="3rd Year AI & DS Batch">3rd Year AI & DS Batch</option>
                    <option value="2nd Year AI & DS Batch">2nd Year AI & DS Batch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={sDept}
                    onChange={(e) => setSDept(e.target.value)}
                    className="ent-input"
                  >
                    <option value="B.TECH AI & DS">B.TECH AI & DS</option>
                    <option value="B.TECH CSBS">B.TECH CSBS</option>
                    <option value="B.E. CSE">B.E. CSE</option>
                    <option value="B.TECH IT">B.TECH IT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Placement Status</label>
                  <select
                    value={sStatus}
                    onChange={(e) => setSStatus(e.target.value)}
                    className="ent-input"
                  >
                    <option value="Unplaced">Unplaced</option>
                    <option value="Placed">Placed</option>
                    <option value="Higher Studies">Higher Studies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Company Name</label>
                  <input
                    type="text"
                    value={sCompany}
                    onChange={(e) => setSCompany(e.target.value)}
                    placeholder="e.g. Zoho Corporation"
                    className="ent-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Package (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sPackage}
                    onChange={(e) => setSPackage(e.target.value)}
                    className="ent-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Attendance %</label>
                  <input
                    type="number"
                    value={sAttendance}
                    onChange={(e) => setSAttendance(e.target.value)}
                    className="ent-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={sSkills}
                  onChange={(e) => setSSkills(e.target.value)}
                  placeholder="Python, LangChain, PyTorch, RAG..."
                  className="ent-input"
                />
              </div>

              {studentError && (
                <div className="p-2 rounded bg-red-50 text-red-700 border border-red-200 text-center font-bold">
                  {studentError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingStudent}
                  className="btn-primary text-xs"
                >
                  {creatingStudent ? "Saving Student..." : "Create Student Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Post Department Notice
            </h3>

            <form onSubmit={handlePostAnnouncement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Innovation Lab Hackathon 2026"
                  className="ent-input"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Content</label>
                <textarea
                  rows={3}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Provide complete notice details..."
                  className="ent-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value)}
                    className="ent-input"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Batch</label>
                  <select
                    value={annBatch}
                    onChange={(e) => setAnnBatch(e.target.value)}
                    className="ent-input"
                  >
                    <option value="All Batches">All Batches</option>
                    <option value="SOI Placement Batch">SOI Placement Batch</option>
                    <option value="3rd Year AI & DS Batch">3rd Year AI & DS Batch</option>
                    <option value="2nd Year AI & DS Batch">2nd Year AI & DS Batch</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingAnn}
                  className="btn-primary text-xs"
                >
                  {postingAnn ? "Posting..." : "Post Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
