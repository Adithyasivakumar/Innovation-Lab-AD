"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, Database, FolderGit2, Shield, User, Award, Sparkles, BrainCircuit } from "lucide-react";

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
    <header className="bg-[#0b132b] text-white border-b border-slate-800 shadow-xl sticky top-0 z-40">
      {/* Top Main Header Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80">
        {/* School of Innovation Logo & Branding */}
        <div className="flex items-center gap-3.5">
          <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-800 text-white font-black text-xl px-3.5 py-2 rounded-2xl shadow-lg border border-blue-400/40 tracking-wider flex items-center justify-center gap-1.5 shrink-0">
            <BrainCircuit className="w-5 h-5 text-amber-300" /> SoI
          </div>
          <div>
            <h1 className="font-black text-lg md:text-xl text-white tracking-tight leading-none">
              School of Innovation
            </h1>
            <p className="text-xs font-bold text-blue-400 mt-1 flex items-center gap-1.5">
              <span>Artificial Intelligence and Data Science Vertical</span>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Innovation Portal
              </span>
            </p>
          </div>
        </div>

        {/* User Profile & Role Switcher */}
        {user && (
          <div className="flex items-center gap-4">
            {/* Quick Role Switcher */}
            <div className="hidden lg:flex items-center bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 px-2.5 uppercase tracking-wider">Role:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => demoLogin("admin")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    user.role === "admin"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => demoLogin("faculty")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    user.role === "faculty"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Faculty
                </button>
                <button
                  onClick={() => demoLogin("student")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
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
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
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
