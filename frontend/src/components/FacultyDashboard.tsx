"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { Users, CheckCircle, Search, Filter, Cpu, Plus, Edit3, Award, BookOpen, Layers } from "lucide-react";

export const FacultyDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchFacultyData = async () => {
    setLoading(true);
    try {
      const [studRes, projRes] = await Promise.all([
        fetch(`${API_BASE}/students?limit=100`),
        fetch(`${API_BASE}/projects`),
      ]);

      if (studRes.ok) {
        const sData = await studRes.json();
        setStudents(sData.students);
      }
      if (projRes.ok) {
        const pData = await projRes.json();
        setProjects(pData);
      }
    } catch (err) {
      console.error("Error fetching faculty data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, [token]);

  const handleVerifyProject = async (projectId: number) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "Verified",
          assigned_faculty_id: user?.id,
        }),
      });

      if (res.ok) {
        fetchFacultyData();
      }
    } catch (err) {
      console.error("Error verifying project:", err);
    }
  };

  const handleSaveStudentAssessment = async () => {
    if (!editingStudent) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/students/${editingStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attendance_pct: editingStudent.attendance_pct,
          skills: editingStudent.skills,
          placement_status: editingStudent.placement_status,
          company_tier: editingStudent.company_tier,
          company_name: editingStudent.company_name,
          package_lpa: editingStudent.package_lpa,
        }),
      });

      if (res.ok) {
        setEditingStudent(null);
        fetchFacultyData();
      }
    } catch (err) {
      console.error("Error updating student:", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesBatch = selectedBatch === "All" || s.batch === selectedBatch;
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Faculty Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-violet-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" /> Faculty Mentor Workspace
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
            Student Skill Matrix & Project Verification
          </h2>
          <p className="text-sm text-slate-400">
            Review student portfolios across 3 active KiTE batches, verify AI prototypes, and update skill matrices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Pending Prototype Reviews</span>
            <span className="text-xl font-bold text-amber-400">
              {projects.filter((p) => p.status === "In Progress").length} Projects
            </span>
          </div>
        </div>
      </div>

      {/* Lab Projects Pending Review Section */}
      <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" /> Innovation Lab Prototypes & Reviews
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-cyan-500/40 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700">
                    {proj.batch}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      proj.status === "Verified"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white leading-snug">{proj.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{proj.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-semibold text-slate-200">{proj.student_name}</span>
                </div>
                {proj.accuracy_metric && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Accuracy/Metric:</span>
                    <span className="font-bold text-emerald-400">{proj.accuracy_metric}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-cyan-400 hover:underline font-mono"
                    >
                      GitHub Repo →
                    </a>
                  )}
                  {proj.status !== "Verified" ? (
                    <button
                      onClick={() => handleVerifyProject(proj.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Verify
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified by {proj.assigned_faculty_name || "Faculty"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Roster Filter & Assessment */}
      <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-400" /> Student Profile & Skill Assessment
          </h3>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Batch Filter */}
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Batches</option>
              <option value="SOI Placement Batch">Batch 1: SOI Placement</option>
              <option value="3rd Year AI & DS Batch">Batch 2: 3rd Year AI & DS</option>
              <option value="2nd Year AI & DS Batch">Batch 3: 2nd Year AI & DS</option>
            </select>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((s) => (
            <div
              key={s.id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3 hover:border-violet-500/40 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">{s.full_name}</h4>
                  <p className="text-xs text-slate-400 font-mono">Roll: {s.roll_number}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                  {s.batch}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Placement Status:</span>
                  <span
                    className={`font-semibold ${
                      s.placement_status === "Placed"
                        ? "text-emerald-400"
                        : s.placement_status === "Higher Studies"
                        ? "text-violet-400"
                        : "text-amber-400"
                    }`}
                  >
                    {s.placement_status} {s.company_name ? `(${s.company_name})` : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Attendance:</span>
                  <span className="font-bold text-slate-200">{s.attendance_pct}%</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {s.skills?.map((sk: string) => (
                  <span
                    key={sk}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setEditingStudent(s)}
                className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" /> Assess Skills & Records
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Faculty Assessment for {editingStudent.full_name} ({editingStudent.roll_number})
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Attendance Percentage (%)</label>
                <input
                  type="number"
                  value={editingStudent.attendance_pct}
                  onChange={(e) => setEditingStudent({ ...editingStudent, attendance_pct: parseFloat(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Placement Status</label>
                <select
                  value={editingStudent.placement_status}
                  onChange={(e) => setEditingStudent({ ...editingStudent, placement_status: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Unplaced">Unplaced</option>
                  <option value="Placed">Placed</option>
                  <option value="Higher Studies">Higher Studies</option>
                </select>
              </div>

              {editingStudent.placement_status === "Placed" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                    <input
                      type="text"
                      value={editingStudent.company_name || ""}
                      onChange={(e) => setEditingStudent({ ...editingStudent, company_name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Package (LPA)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingStudent.package_lpa || 0}
                      onChange={(e) => setEditingStudent({ ...editingStudent, package_lpa: parseFloat(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assessed Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={editingStudent.skills?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStudentAssessment}
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg"
              >
                {saving ? "Saving..." : "Save Assessment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
