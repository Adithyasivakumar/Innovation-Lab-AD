"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, Database, FolderGit2, Shield, User, Award } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout, demoLogin } = useAuth();

  return (
    <header className="bg-[#0f172a] text-white border-b border-slate-800 shadow-md">
      {/* Top Accreditation & College Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-700 text-white font-black text-xl px-3 py-1.5 rounded-lg tracking-wider border border-blue-500 shadow">
            KiTE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base md:text-lg text-white leading-none">
                KGiSL Institute of Technology
              </h1>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <Award className="w-3 h-3" /> NAAC A Grade
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Department of Artificial Intelligence & Data Science • Innovation Lab Portal
            </p>
          </div>
        </div>

        {/* User Info & Role Switcher */}
        {user && (
          <div className="flex items-center gap-4 text-xs">
            {/* Quick Demo Switcher */}
            <div className="hidden lg:flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold px-2">Role:</span>
              <button
                onClick={() => demoLogin("admin")}
                className={`px-2 py-1 rounded font-bold transition ${
                  user.role === "admin" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => demoLogin("faculty")}
                className={`px-2 py-1 rounded font-bold transition ${
                  user.role === "faculty" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                Faculty
              </button>
              <button
                onClick={() => demoLogin("student")}
                className={`px-2 py-1 rounded font-bold transition ${
                  user.role === "student" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                Student
              </button>
            </div>

            {/* Current Logged User */}
            <div className="text-right">
              <div className="font-bold text-white flex items-center justify-end gap-1">
                <User className="w-3.5 h-3.5 text-blue-400" /> {user.full_name}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">{user.role} Account</div>
            </div>

            <button
              onClick={logout}
              className="px-3 py-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-800/50 rounded-lg transition font-semibold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center space-x-1 text-xs">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-3 px-4 font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "border-blue-500 text-blue-400 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> My Workspace
          </button>

          {(user.role === "admin" || user.role === "faculty") && (
            <button
              onClick={() => setActiveTab("datagrid")}
              className={`py-3 px-4 font-bold border-b-2 transition flex items-center gap-2 ${
                activeTab === "datagrid"
                  ? "border-blue-500 text-blue-400 bg-slate-800/40"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Database className="w-4 h-4" /> Student Data Matrix
            </button>
          )}

          <button
            onClick={() => setActiveTab("projects")}
            className={`py-3 px-4 font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === "projects"
                ? "border-blue-500 text-blue-400 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FolderGit2 className="w-4 h-4" /> AI Innovation Prototypes
          </button>
        </div>
      )}
    </header>
  );
};
