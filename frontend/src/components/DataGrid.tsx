"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { Search, Download, ArrowUpDown, ChevronLeft, ChevronRight, FileSpreadsheet, Trash2 } from "lucide-react";

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
    if (!window.confirm(`Are you sure you want to delete student record ${roll}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchStudents();
      } else {
        alert("Failed to delete record.");
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-700" /> Student Data Matrix Directory
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Comprehensive student records for Batch 1 (SOI), Batch 2 (3rd Year), and Batch 3 (2nd Year).
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="btn-kite-primary text-xs flex items-center gap-2 shadow"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Name, Roll, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="kite-input w-full pl-9"
            />
          </form>

          <div>
            <select
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                setPage(1);
              }}
              className="kite-input w-full"
            >
              <option value="All">All Batches</option>
              <option value="SOI Placement Batch">Batch 1: SOI Placement</option>
              <option value="3rd Year AI & DS Batch">Batch 2: 3rd Year AI & DS</option>
              <option value="2nd Year AI & DS Batch">Batch 3: 2nd Year AI & DS</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="kite-input w-full"
            >
              <option value="All">All Placement Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Unplaced">Unplaced</option>
              <option value="Higher Studies">Higher Studies</option>
            </select>
          </div>

          <div>
            <select
              value={selectedSkill}
              onChange={(e) => {
                setSelectedSkill(e.target.value);
                setPage(1);
              }}
              className="kite-input w-full"
            >
              <option value="All">All Skills</option>
              <option value="PyTorch">PyTorch</option>
              <option value="TensorFlow">TensorFlow</option>
              <option value="NLP">NLP</option>
              <option value="Computer Vision">Computer Vision</option>
              <option value="FastAPI">FastAPI</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="kite-table text-xs">
            <thead>
              <tr>
                <th className="cursor-pointer" onClick={() => handleSort("roll_number")}>
                  <div className="flex items-center gap-1">Roll No <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort("full_name")}>
                  <div className="flex items-center gap-1">Student Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th>Batch</th>
                <th>Status / Company</th>
                <th>Package</th>
                <th>Skills</th>
                <th>Attendance</th>
                {user?.role === "admin" && <th className="text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500">Loading student records...</td>
                </tr>
              ) : sortedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500">No matching student records found.</td>
                </tr>
              ) : (
                sortedStudents.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono font-bold text-blue-700">{s.roll_number}</td>
                    <td>
                      <div className="font-bold text-slate-900">{s.full_name}</div>
                      <div className="text-[10px] text-slate-500">{s.email}</div>
                    </td>
                    <td>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {s.batch}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          s.placement_status === "Placed"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {s.placement_status}
                      </span>
                      {s.company_name && (
                        <div className="text-[10px] text-slate-600 font-semibold mt-0.5">{s.company_name}</div>
                      )}
                    </td>
                    <td className="font-bold text-emerald-700">
                      {s.package_lpa > 0 ? `${s.package_lpa} LPA` : "-"}
                    </td>
                    <td className="max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {s.skills?.map((sk: string) => (
                          <span key={sk} className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="font-bold text-slate-800">{s.attendance_pct}%</td>
                    {user?.role === "admin" && (
                      <td className="text-center">
                        <button
                          onClick={() => handleDeleteStudent(s.id, s.roll_number)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                          title="Delete Record"
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

        {/* Footer Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-900">{sortedStudents.length}</span> of <span className="font-bold text-slate-900">{total}</span> records
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
