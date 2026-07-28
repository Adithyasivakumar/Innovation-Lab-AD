"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { Users, CheckCircle2, Clock, Filter, Search, Award, ExternalLink, Edit3, X, Check, FolderGit2 } from "lucide-react";
import { GithubIcon } from "./Icons";

export const FacultyDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "students">("projects");

  // Editing student skill / status modal
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [updatingStudent, setUpdatingStudent] = useState(false);

  const fetchFacultyData = async () => {
    setLoading(true);
    try {
      const [projRes, studRes] = await Promise.all([
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/students?limit=50`),
      ]);

      if (projRes.ok) {
        const pData = await projRes.json();
        setProjects(pData);
      }
      if (studRes.ok) {
        const sData = await studRes.json();
        setStudents(sData.students || []);
      }
    } catch (err) {
      console.error("Error loading faculty data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const handleVerifyProject = async (projectId: number, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/status?status=${encodeURIComponent(newStatus)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchFacultyData();
      }
    } catch (err) {
      console.error("Error updating project status:", err);
    }
  };

  const handleSaveStudentEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setUpdatingStudent(true);

    try {
      const res = await fetch(`${API_BASE}/students/${editingStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          placement_status: editingStudent.placement_status,
          company_name: editingStudent.company_name,
          package_lpa: parseFloat(editingStudent.package_lpa) || 0,
          skills: editingStudent.skills,
        }),
      });

      if (res.ok) {
        setEditingStudent(null);
        fetchFacultyData();
      }
    } catch (err) {
      console.error("Error updating student profile:", err);
    } finally {
      setUpdatingStudent(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesBatch = selectedBatch === "All" || p.batch === selectedBatch;
    return matchesBatch;
  });

  const filteredStudents = students.filter((s) => {
    const matchesBatch = selectedBatch === "All" || s.batch === selectedBatch;
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll_number.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  const pendingCount = projects.filter((p) => p.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#1e3a8a] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30 shadow-xs">
            <Users className="w-4 h-4 text-blue-400" /> Faculty Mentor Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome, {user?.full_name}
          </h2>
          <p className="text-xs text-slate-300 font-medium">
            Academic verification queue & assigned student batch records for AI & DS department.
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shadow-inner text-xs font-bold">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "projects" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <FolderGit2 className="w-4 h-4" /> Prototype Verification ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "students" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" /> Student Roster ({students.length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="ent-card p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700">Filter by Batch:</span>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="ent-input text-xs w-auto"
          >
            <option value="All">All 3 Batches</option>
            <option value="SOI Placement Batch">Batch 1: SOI Placement</option>
            <option value="3rd Year AI & DS Batch">Batch 2: 3rd Year AI & DS</option>
            <option value="2nd Year AI & DS Batch">Batch 3: 2nd Year AI & DS</option>
          </select>
        </div>

        {activeTab === "students" && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search student name or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ent-input pl-10"
            />
          </div>
        )}
      </div>

      {/* TAB 1: Prototype Verification Queue */}
      {activeTab === "projects" && (
        <div className="ent-card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Submitted Student AI Models & Prototypes</span>
            <span className="text-xs font-normal text-slate-500">Review model accuracy before approval</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.length === 0 ? (
              <p className="text-xs text-slate-500 col-span-2 text-center py-8">
                No prototype submissions match the selected batch.
              </p>
            ) : (
              filteredProjects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="badge-batch">{proj.batch}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          proj.status === "Verified"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    {proj.accuracy_metric && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Metric Result:</span>
                        <span className="font-bold text-blue-700">{proj.accuracy_metric}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {proj.tech_stack?.map((t: string) => (
                        <span key={t} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <div className="flex items-center gap-3">
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-blue-700 font-bold hover:underline flex items-center gap-1">
                            <GithubIcon className="w-3.5 h-3.5" /> Code
                          </a>
                        )}
                        {proj.demo_url && (
                          <a href={proj.demo_url} target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                          </a>
                        )}
                      </div>

                      {proj.status === "Pending" ? (
                        <button
                          onClick={() => handleVerifyProject(proj.id, "Verified")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Model
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifyProject(proj.id, "Pending")}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold text-xs transition"
                        >
                          Revoke Verification
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Assigned Student Roster */}
      {activeTab === "students" && (
        <div className="ent-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-sm">
            Assigned Student Directory
          </div>

          <div className="overflow-x-auto">
            <table className="ent-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Batch</th>
                  <th>Placement Status</th>
                  <th>Skills</th>
                  <th>Attendance</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">No matching student records found.</td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id}>
                      <td className="font-mono font-bold text-blue-700">{s.roll_number}</td>
                      <td>
                        <div className="font-bold text-slate-900">{s.full_name}</div>
                        <div className="text-xs text-slate-500">{s.email}</div>
                      </td>
                      <td>
                        <span className="badge-batch">{s.batch}</span>
                      </td>
                      <td>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            s.placement_status === "Placed"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {s.placement_status}
                        </span>
                        {s.company_name && (
                          <div className="text-xs text-slate-600 font-semibold mt-0.5">{s.company_name}</div>
                        )}
                      </td>
                      <td className="max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {s.skills?.map((sk: string) => (
                            <span key={sk} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="font-bold text-slate-800">{s.attendance_pct}%</td>
                      <td className="text-center">
                        <button
                          onClick={() => setEditingStudent(s)}
                          className="btn-secondary text-xs py-1 px-2.5 gap-1 mx-auto"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-600" /> Edit Record
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Student Record Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Update Student Record - {editingStudent.full_name}
              </h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Placement Status</label>
                <select
                  value={editingStudent.placement_status}
                  onChange={(e) => setEditingStudent({ ...editingStudent, placement_status: e.target.value })}
                  className="ent-input"
                >
                  <option value="Unplaced">Unplaced</option>
                  <option value="Placed">Placed</option>
                  <option value="Higher Studies">Higher Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Company Name</label>
                <input
                  type="text"
                  value={editingStudent.company_name || ""}
                  onChange={(e) => setEditingStudent({ ...editingStudent, company_name: e.target.value })}
                  placeholder="e.g. Zoho Corporation"
                  className="ent-input"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Salary Package (LPA)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingStudent.package_lpa || 0}
                  onChange={(e) => setEditingStudent({ ...editingStudent, package_lpa: e.target.value })}
                  className="ent-input"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={editingStudent.skills?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="ent-input"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStudent}
                  className="btn-primary text-xs"
                >
                  {updatingStudent ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
