"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { Users, CheckCircle, Clock, Search, Filter, ExternalLink, ShieldCheck, RefreshCw, XCircle } from "lucide-react";
import { GithubIcon } from "./Icons";

export const FacultyDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"projects" | "students">("projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchFacultyData = async () => {
    setLoading(true);
    try {
      const [projRes, studRes] = await Promise.all([
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/students`),
      ]);

      if (projRes.ok) {
        const pData = await projRes.json();
        setProjects(pData);
      }
      if (studRes.ok) {
        const sData = await studRes.json();
        setStudents(sData);
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

  const handleUpdateProjectStatus = async (projectId: number, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          assigned_faculty_id: user?.id,
        }),
      });

      if (res.ok) {
        fetchFacultyData();
      }
    } catch (err) {
      console.error("Error updating project status:", err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech_stack?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = projects.filter((p) => p.status === "Pending").length;
  const verifiedCount = projects.filter((p) => p.status === "Verified").length;

  return (
    <div className="space-y-6">
      {/* Top Jet Black Hero Banner */}
      <div className="bg-black text-white rounded-xl p-6 sm:p-7 shadow-xs border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/80">
            <Users className="w-3.5 h-3.5" /> Faculty Innovation Portal
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Welcome, {user?.full_name}
          </h2>
          <p className="text-xs text-zinc-400 font-semibold">
            School of Innovation • Artificial Intelligence & Data Science Mentor Review Queue
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-center min-w-28">
            <div className="text-xs text-zinc-400 font-bold uppercase">Pending Models</div>
            <div className="text-xl font-extrabold text-blue-400">{pendingCount}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-center min-w-28">
            <div className="text-xs text-zinc-400 font-bold uppercase">Verified Models</div>
            <div className="text-xl font-extrabold text-white">{verifiedCount}</div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="ent-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-1.5 rounded transition-colors ${
              activeTab === "projects"
                ? "bg-black text-white shadow-xs"
                : "text-slate-700 hover:text-black"
            }`}
          >
            Prototype Verification Queue ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-1.5 rounded transition-colors ${
              activeTab === "students"
                ? "bg-black text-white shadow-xs"
                : "text-slate-700 hover:text-black"
            }`}
          >
            Assigned Student Roster ({students.length})
          </button>
        </div>

        {activeTab === "projects" && (
          <div className="flex items-center gap-3 text-xs">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prototype models..."
                className="ent-input pl-9"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ent-input w-32"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Body */}
      {activeTab === "projects" ? (
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="ent-card p-12 text-center text-xs text-slate-500 font-medium">
              No AI prototype models matching the criteria.
            </div>
          ) : (
            filteredProjects.map((p) => (
              <div key={p.id} className="ent-card p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-black text-sm">{p.title}</h4>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                        p.status === "Verified"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : p.status === "Pending"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">{p.description}</p>
                  </div>

                  <div className="text-xs text-slate-600 sm:text-right">
                    <div>Submitted by: <strong className="text-black font-extrabold">{p.student_name || "Student"}</strong></div>
                    <div className="font-mono text-[11px] text-slate-500">Batch: {p.batch}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {p.accuracy_metric && (
                      <span className="bg-slate-100 text-black text-[11px] font-bold px-2.5 py-0.5 rounded border border-slate-200">
                        Metric: {p.accuracy_metric}
                      </span>
                    )}
                    {p.tech_stack?.map((t: string, idx: number) => (
                      <span key={idx} className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {p.github_url && (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary text-xs py-1 px-2.5 gap-1 font-bold"
                      >
                        <GithubIcon className="w-3.5 h-3.5" /> Repository
                      </a>
                    )}

                    {p.status !== "Verified" ? (
                      <button
                        onClick={() => handleUpdateProjectStatus(p.id, "Verified")}
                        className="btn-primary text-xs py-1 px-3 gap-1 font-bold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Verify Model
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateProjectStatus(p.id, "Pending")}
                        className="btn-secondary text-xs py-1 px-2.5 text-slate-800 border-slate-300 bg-slate-100 hover:bg-slate-200 font-bold"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Revoke Verification
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="ent-card overflow-hidden">
          <div className="p-4 border-b border-slate-200 font-extrabold text-black text-sm">
            Assigned Student Roster
          </div>
          <div className="overflow-x-auto">
            <table className="ent-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Batch</th>
                  <th>Placement Status</th>
                  <th>Company</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono font-extrabold text-black">{s.roll_number}</td>
                    <td className="font-bold text-black">{s.full_name}</td>
                    <td className="text-slate-700 font-medium">{s.batch}</td>
                    <td>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        s.placement_status === "Placed"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                        {s.placement_status}
                      </span>
                    </td>
                    <td className="font-bold text-slate-900">{s.company_name || "—"}</td>
                    <td className="font-extrabold text-black">{s.attendance_pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
