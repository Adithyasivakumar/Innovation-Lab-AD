"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import {
  Users,
  GraduationCap,
  Briefcase,
  Layers,
  Upload,
  FileSpreadsheet,
  Activity,
  Award,
  TrendingUp,
  Cpu,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface AdminDashboardProps {
  onOpenBulkUpload: () => void;
  onNavigateDataGrid: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenBulkUpload,
  onNavigateDataGrid,
}) => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, logsRes] = await Promise.all([
        fetch(`${API_BASE}/analytics/summary`),
        fetch(`${API_BASE}/audit-logs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setAnalytics(aData);
      }
      if (logsRes.ok) {
        const lData = await logsRes.json();
        setAuditLogs(lData);
      }
    } catch (err) {
      console.error("Error fetching admin analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading KiTE Analytics Engine...</p>
        </div>
      </div>
    );
  }

  const { overview, batch_metrics, placement_stats, skill_distribution } = analytics;

  // Colors for charts
  const COLORS = ["#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#3b82f6"];

  const placementPieData = [
    { name: "Placed Students", value: placement_stats.placed_count, color: "#10b981" },
    { name: "Unplaced / Seeking", value: placement_stats.unplaced_count, color: "#f59e0b" },
    { name: "Higher Studies", value: placement_stats.higher_studies_count, color: "#8b5cf6" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-cyan-500/20 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Superuser Control Hub
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            AI & DS Innovation Lab Overview
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Real-time batch metrics, placement tracking funnel, skills matrix analysis, and system audit logs.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 z-10">
          <button
            onClick={onOpenBulkUpload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition active:scale-95"
          >
            <Upload className="w-4 h-4" /> Bulk Upload Students (CSV)
          </button>

          <button
            onClick={onNavigateDataGrid}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Manage Data Grid
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Enrolled Students</p>
            <h3 className="text-3xl font-black text-white mt-1">{overview.total_students}</h3>
            <p className="text-xs text-cyan-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Across 3 Active Batches
            </p>
          </div>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Lab Prototypes</p>
            <h3 className="text-3xl font-black text-white mt-1">{overview.total_projects}</h3>
            <p className="text-xs text-emerald-400 mt-1 font-medium">
              {overview.active_lab_users} Active Contributor Students
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">SOI Placement Rate</p>
            <h3 className="text-3xl font-black text-emerald-400 mt-1">
              {placement_stats.placed_count + placement_stats.unplaced_count > 0
                ? Math.round(
                    (placement_stats.placed_count /
                      (placement_stats.placed_count + placement_stats.unplaced_count + placement_stats.higher_studies_count)) *
                      100
                  )
                : 0}
              %
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {placement_stats.placed_count} Placed • Highest {placement_stats.highest_package_lpa} LPA
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Salary Package</p>
            <h3 className="text-3xl font-black text-violet-400 mt-1">
              {placement_stats.avg_package_lpa} <span className="text-sm font-normal text-slate-300">LPA</span>
            </h3>
            <p className="text-xs text-violet-300 mt-1 font-medium">
              Tier 1: {placement_stats.tier1_count} | Tier 2: {placement_stats.tier2_count}
            </p>
          </div>
          <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-xl text-violet-400">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Student Distribution Chart */}
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" /> Batch Distribution & Lab Activity
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-time DB Sync</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batch_metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="batch_name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                />
                <Bar dataKey="total_students" name="Total Enrolled" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="active_lab_users" name="Active Lab Users" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SOI Placement Success Rate Pie Chart */}
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" /> SOI Placement Batch Funnel
            </h3>
            <span className="text-xs text-slate-400 font-mono">Final Year Track</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={placementPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {placementPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px", color: "#cbd5e1" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Skills Distribution & System Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Skills Matrix */}
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4 lg:col-span-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-violet-400" /> Top AI/DS Skills Matrix
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {skill_distribution.map((sk: any, i: number) => (
              <div key={sk.skill_name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-sm font-semibold text-slate-200">{sk.skill_name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
                      style={{ width: `${Math.min((sk.student_count / overview.total_students) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-cyan-400 w-8 text-right">{sk.student_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Audit Logs */}
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" /> System Audit Stream
            </h3>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              Live Auditing
            </span>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{log.user_name}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-400 truncate max-w-xs">{log.details}</td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
