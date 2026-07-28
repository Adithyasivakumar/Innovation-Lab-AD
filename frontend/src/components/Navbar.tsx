"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Cpu, LogOut, UserCheck, Shield, GraduationCap, Users } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout, demoLogin } = useAuth();

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between shadow-xl">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
        <div className="p-2.5 bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center">
          <Cpu className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            KiTE <span className="gradient-text-kite">AI & DS</span> Innovation Lab
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            KGiSL Institute of Technology • Enterprise Portal
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === "dashboard"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("datagrid")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === "datagrid"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          Student Matrix Data Grid
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === "projects"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          Lab Projects
        </button>
      </nav>

      {/* User Actions & Quick Role Switcher */}
      <div className="flex items-center space-x-4">
        {/* Quick Role Switcher pill dropdown for demonstration */}
        <div className="hidden lg:flex items-center bg-slate-900/80 border border-slate-800 rounded-full px-2 py-1 text-xs text-slate-400 space-x-1">
          <span className="font-semibold text-slate-300 px-2">Switch Demo Role:</span>
          <button
            onClick={() => demoLogin("admin")}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
              user?.role === "admin"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            <Shield className="w-3 h-3" /> Admin
          </button>
          <button
            onClick={() => demoLogin("faculty")}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
              user?.role === "faculty"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            <Users className="w-3 h-3" /> Faculty
          </button>
          <button
            onClick={() => demoLogin("student")}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
              user?.role === "student"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            <GraduationCap className="w-3 h-3" /> Student
          </button>
        </div>

        {/* Current User Info */}
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">{user.full_name}</p>
              <div className="flex justify-end items-center gap-1 mt-0.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    user.role === "admin"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : user.role === "faculty"
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {user.role === "admin" ? "Lab Head / Superuser" : user.role}
                </span>
              </div>
            </div>

            <img
              src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              alt={user.full_name}
              className="w-10 h-10 rounded-full border-2 border-cyan-500/40 object-cover shadow-lg"
            />

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-xl transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};
