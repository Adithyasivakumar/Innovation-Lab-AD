"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, Database, FolderGit2, Shield, User, Award, ChevronDown, Sparkles } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout, demoLogin } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="bg-[#0b132b] text-white border-b border-slate-800 shadow-lg sticky top-0 z-40">
      {/* Top Banner & User Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80">
        {/* Brand Header */}
        <div className="flex items-center gap-3.5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black text-xl px-3.5 py-1.5 rounded-xl shadow-md border border-blue-500/40 tracking-wider flex items-center justify-center">
            KiTE
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-extrabold text-base md:text-lg text-white tracking-tight leading-none">
                KGiSL Institute of Technology
              </h1>
              <span className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Award className="w-3 h-3 text-amber-400" /> NAAC A Grade
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Department of Artificial Intelligence & Data Science • Innovation Lab Portal
            </p>
          </div>
        </div>

        {/* User Profile & Demo Switcher */}
        {user && (
          <div className="flex items-center gap-4">
            {/* Quick Role Switcher */}
            <div className="hidden lg:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 px-2.5 uppercase tracking-wider">Role:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => demoLogin("admin")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    user.role === "admin"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => demoLogin("faculty")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    user.role === "faculty"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Faculty
                </button>
                <button
                  onClick={() => demoLogin("student")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    user.role === "student"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Student
                </button>
              </div>
            </div>

            {/* Logged User Chip */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-md border border-blue-400/30">
                {getInitials(user.full_name)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-bold text-xs text-white leading-snug">{user.full_name}</div>
                <div className="text-[10px] font-semibold text-blue-400 capitalize">{user.role} Account</div>
              </div>
              <button
                onClick={logout}
                className="p-2 bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900/50 rounded-xl transition-all shadow-xs"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Navigation Bar */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 text-xs">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-3 px-4 font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "text-blue-400 bg-slate-900/60 font-extrabold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> My Workspace
            {activeTab === "dashboard" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>

          {(user.role === "admin" || user.role === "faculty") && (
            <button
              onClick={() => setActiveTab("datagrid")}
              className={`py-3 px-4 font-bold transition-all relative flex items-center gap-2 ${
                activeTab === "datagrid"
                  ? "text-blue-400 bg-slate-900/60 font-extrabold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
              }`}
            >
              <Database className="w-4 h-4" /> Student Data Matrix
              {activeTab === "datagrid" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab("projects")}
            className={`py-3 px-4 font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "projects"
                ? "text-blue-400 bg-slate-900/60 font-extrabold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
            }`}
          >
            <FolderGit2 className="w-4 h-4" /> AI Innovation Prototypes
            {activeTab === "projects" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>
      )}
    </header>
  );
};
