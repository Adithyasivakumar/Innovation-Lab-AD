"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { Users, GraduationCap, Upload, Shield, Award, Activity, Layers, Download, PlusCircle, TrendingUp, Sparkles } from "lucide-react";

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
      {/* Top Banner Hero Card */}
      <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#1e3a8a] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30 shadow-xs">
            <Shield className="w-4 h-4 text-blue-400" /> Executive Admin Operations
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome, {user?.full_name}
          </h2>
          <p className="text-xs text-slate-300 font-medium">
            Administrative control center for AI & DS department • Batch statistics & roster management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAnnModal(true)}
            className="btn-secondary text-xs gap-1.5 shadow-sm font-bold"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" /> Post Department Notice
          </button>
          <button
            onClick={onOpenBulkUpload}
            className="btn-primary text-xs gap-1.5 shadow-md font-bold"
          >
            <Upload className="w-4 h-4" /> Bulk Import Students
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="ent-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{overview.total_students || 0}</div>
          <div className="text-xs text-slate-500">Across 3 academic batches</div>
        </div>

        <div className="ent-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">SOI Placed Count</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">{placement.placed_count || 0}</div>
          <div className="text-xs text-slate-500">Highest Package: <strong className="text-slate-800">{placement.highest_package_lpa || 0} LPA</strong></div>
        </div>

        <div className="ent-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Prototypes</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-700">{overview.total_projects || 0}</div>
          <div className="text-xs text-slate-500">Verified AI/DS Models</div>
        </div>

        <div className="ent-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg SOI Package</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700">{placement.avg_package_lpa || 0} LPA</div>
          <div className="text-xs text-slate-500">Tier 1 Recruiters: <strong className="text-slate-800">{placement.tier1_count || 0}</strong></div>
        </div>
      </div>

      {/* Batch Overview Matrix */}
      <div className="ent-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-bold text-slate-900 text-sm flex items-center justify-between">
          <span>Batch Wise Performance Matrix</span>
          <button
            onClick={onNavigateDataGrid}
            className="text-xs font-bold text-blue-700 hover:underline"
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

      {/* Activity Audit Log Stream */}
      <div className="ent-card p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
          <Activity className="w-4 h-4 text-blue-600" /> System Audit & User Activity Stream
        </h3>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No recent activity logged.</p>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs">
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

      {/* Post Notice Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Post Department Notice
            </h3>

            <form onSubmit={handlePostAnnouncement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Notice Title</label>
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
                <label className="block text-slate-700 font-bold mb-1">Notice Content</label>
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
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
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
                  <label className="block text-slate-700 font-bold mb-1">Target Batch</label>
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
