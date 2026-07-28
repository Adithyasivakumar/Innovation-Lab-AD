"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, Database, FolderGit2, Shield, User } from "lucide-react";

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
    <header className="bg-[#0f172a] text-white border-b border-slate-800 sticky top-0 z-40">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Logo Section */}
        <div className="flex items-center gap-3.5">
          {/* Official School of Innovation Logo Image */}
          <div className="h-10 w-auto flex items-center justify-center bg-white p-1 rounded-lg border border-slate-700 shadow-sm shrink-0">
            <img
              src="/soi-logo.jpg"
              alt="School of Innovation Logo"
              className="h-8 w-auto object-contain rounded"
            />
          </div>

          <div className="h-7 w-px bg-slate-800 hidden sm:block" />

          <div>
            <h1 className="font-bold text-base md:text-lg text-white tracking-tight leading-snug">
              School of Innovation
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Artificial Intelligence and Data Science Vertical
            </p>
          </div>
        </div>

        {/* User Profile & Demo Switcher */}
        {user && (
          <div className="flex items-center gap-4">
            {/* Role Selector Pill */}
            <div className="hidden lg:flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider">Role:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => demoLogin("admin")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    user.role === "admin"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => demoLogin("faculty")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    user.role === "faculty"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  Faculty
                </button>
                <button
                  onClick={() => demoLogin("student")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    user.role === "student"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  Student
                </button>
              </div>
            </div>

            {/* Logged User Avatar */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {getInitials(user.full_name)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-semibold text-xs text-white leading-tight">{user.full_name}</div>
                <div className="text-[11px] text-slate-400 capitalize">{user.role} Account</div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Tabs */}
      {user && (
        <div className="border-t border-slate-800/80 bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2.5 px-4 transition-colors relative flex items-center gap-2 ${
                activeTab === "dashboard"
                  ? "text-blue-400 bg-slate-800/60 font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard Overview
              {activeTab === "dashboard" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>

            {(user.role === "admin" || user.role === "faculty") && (
              <button
                onClick={() => setActiveTab("datagrid")}
                className={`py-2.5 px-4 transition-colors relative flex items-center gap-2 ${
                  activeTab === "datagrid"
                    ? "text-blue-400 bg-slate-800/60 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                }`}
              >
                <Database className="w-4 h-4" /> Student Data Matrix
                {activeTab === "datagrid" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            )}

            <button
              onClick={() => setActiveTab("projects")}
              className={`py-2.5 px-4 transition-colors relative flex items-center gap-2 ${
                activeTab === "projects"
                  ? "text-blue-400 bg-slate-800/60 font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <FolderGit2 className="w-4 h-4" /> AI Innovation Prototypes
              {activeTab === "projects" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
