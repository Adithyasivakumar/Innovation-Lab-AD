"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { Users, GraduationCap, Upload, Shield, Award, Activity, Layers, Download, PlusCircle } from "lucide-react";

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

  // New Announcement modal state
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annPriority, setAnnPriority] = useState("Normal");
  const [annBatch, setAnnBatch] = useState("All Batches");
  const [postingAnn, setPostingAnn] = useState(false);

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

  const overview = summary?.overview || {};
  const placement = summary?.placement_stats || {};
  const batchMetrics = summary?.batch_metrics || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            <Shield className="w-3.5 h-3.5" /> Administrative Superuser Operations
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            Welcome, {user?.full_name}
          </h2>
          <p className="text-xs text-slate-600">
            Department of Artificial Intelligence & Data Science • Administrative Control & Analytics Summary
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAnnModal(true)}
            className="btn-kite-secondary text-xs flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-blue-700" /> Post Lab Notice
          </button>
          <button
            onClick={onOpenBulkUpload}
            className="btn-kite-primary text-xs flex items-center gap-1.5 shadow"
          >
            <Upload className="w-4 h-4" /> Bulk Import Students
          </button>
        </div>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Enrolled Students</div>
          <div className="text-2xl font-black text-slate-900">{overview.total_students || 0}</div>
          <div className="text-[11px] text-blue-700 font-semibold">Spread across 3 batches</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Placed SOI Students</div>
          <div className="text-2xl font-black text-emerald-700">{placement.placed_count || 0}</div>
          <div className="text-[11px] text-slate-500">Highest Package: <span className="font-bold text-slate-800">{placement.highest_package_lpa || 0} LPA</span></div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Lab Prototypes</div>
          <div className="text-2xl font-black text-blue-700">{overview.total_projects || 0}</div>
          <div className="text-[11px] text-slate-500">Verified AI/DS Models</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average SOI Package</div>
          <div className="text-2xl font-black text-amber-700">{placement.avg_package_lpa || 0} LPA</div>
          <div className="text-[11px] text-slate-500">Tier 1 Recruiters: <span className="font-bold text-slate-800">{placement.tier1_count || 0}</span></div>
        </div>
      </div>

      {/* Batch Overview Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-sm flex items-center justify-between">
          <span>Batch Wise Statistics Overview</span>
          <button
            onClick={onNavigateDataGrid}
            className="text-xs font-bold text-blue-700 hover:underline"
          >
            Open Full Data Matrix →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="kite-table text-xs">
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Total Students</th>
                <th>Active Lab Users</th>
                <th>Placed Students</th>
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

      {/* Audit Log Stream */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
          <Activity className="w-4 h-4 text-blue-700" /> Recent System Audit Logs
        </h3>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">No recent audit log activity.</p>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div className="space-x-2">
                  <span className="font-bold text-slate-900">{log.user_email}</span>
                  <span className="text-slate-600">({log.action})</span>
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

      {/* Post Notice Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Post Institutional Notice
            </h3>

            <form onSubmit={handlePostAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Innovation Lab Hackathon 2026"
                  className="kite-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notice Content</label>
                <textarea
                  rows={3}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Provide complete notice details..."
                  className="kite-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value)}
                    className="kite-input w-full"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Batch</label>
                  <select
                    value={annBatch}
                    onChange={(e) => setAnnBatch(e.target.value)}
                    className="kite-input w-full"
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
                  className="btn-kite-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingAnn}
                  className="btn-kite-primary text-xs"
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
