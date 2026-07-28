"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { Search, Download, Filter, ArrowUpDown, ChevronLeft, ChevronRight, FileSpreadsheet, FileText, Trash2, Edit3, ShieldAlert } from "lucide-react";

export const DataGrid: React.FC = () => {
  const { token, user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("All");

  // Sorting
  const [sortField, setSortField] = useState<string>("roll_number");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: searchTerm,
        batch: selectedBatch,
        placement_status: selectedStatus,
        skill: selectedSkill,
      });

      const res = await fetch(`${API_BASE}/students?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students);
        setTotal(data.total);
      }
    } catch (err) {
      console.error("Error fetching data grid students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, selectedBatch, selectedStatus, selectedSkill]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Client-side sort on loaded page records
  const sortedStudents = [...students].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleDeleteStudent = async (id: number, roll: string) => {
    if (!window.confirm(`Are you sure you want to delete student ${roll}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchStudents();
      } else {
        alert("Failed to delete record. Admin access required.");
      }
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const handleExportCSV = () => {
    window.open(`${API_BASE}/students/export/csv`, "_blank");
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Controls Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400" /> Student Data Matrix Grid
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Multi-tag filtered directory across Batch 1 (SOI), Batch 2 (3rd Year), and Batch 3 (2nd Year).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>
        </div>

        {/* Multi-Tag Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Name, Roll, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </form>

          {/* Batch Selector */}
          <div>
            <select
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Student Batches</option>
              <option value="SOI Placement Batch">Batch 1: SOI Placement</option>
              <option value="3rd Year AI & DS Batch">Batch 2: 3rd Year AI & DS</option>
              <option value="2nd Year AI & DS Batch">Batch 3: 2nd Year AI & DS</option>
            </select>
          </div>

          {/* Placement Status Selector */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Placement Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Unplaced">Unplaced</option>
              <option value="Higher Studies">Higher Studies</option>
            </select>
          </div>

          {/* Skill Filter Selector */}
          <div>
            <select
              value={selectedSkill}
              onChange={(e) => {
                setSelectedSkill(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All AI/DS Skills</option>
              <option value="PyTorch">PyTorch</option>
              <option value="TensorFlow">TensorFlow</option>
              <option value="NLP">NLP</option>
              <option value="Computer Vision">Computer Vision</option>
              <option value="FastAPI">FastAPI</option>
              <option value="OpenCV">OpenCV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card rounded-2xl border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-300 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort("roll_number")}>
                  <div className="flex items-center gap-1">Roll No <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort("full_name")}>
                  <div className="flex items-center gap-1">Student Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort("placement_status")}>
                  <div className="flex items-center gap-1">Status / Company <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort("package_lpa")}>
                  <div className="flex items-center gap-1">Package <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-4">Skills</th>
                <th className="py-3 px-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort("attendance_pct")}>
                  <div className="flex items-center gap-1">Attendance <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                {user?.role === "admin" && <th className="py-3 px-4 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">Loading student records...</td>
                </tr>
              ) : sortedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">No matching student records found.</td>
                </tr>
              ) : (
                sortedStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">{s.roll_number}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{s.full_name}</div>
                      <div className="text-[10px] text-slate-400">{s.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {s.batch}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.placement_status === "Placed"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : s.placement_status === "Higher Studies"
                            ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {s.placement_status}
                      </span>
                      {s.company_name && (
                        <div className="text-[10px] font-semibold text-slate-300 mt-0.5">{s.company_name}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {s.package_lpa > 0 ? `${s.package_lpa} LPA` : "-"}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {s.skills?.map((sk: string) => (
                          <span key={sk} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-violet-300 border border-slate-700">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {s.attendance_pct}%
                    </td>
                    {user?.role === "admin" && (
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteStudent(s.id, s.roll_number)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-bold text-white">{sortedStudents.length}</span> of <span className="font-bold text-white">{total}</span> records
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-200">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
