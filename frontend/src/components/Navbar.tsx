"use client";

import React from "react";
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
    <header className="bg-black text-white border-b border-zinc-800 sticky top-0 z-40 shadow-sm">
      {/* Top Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* School of Innovation Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-auto flex items-center justify-center bg-white p-1 rounded-lg border border-zinc-700 shadow-sm shrink-0">
            <img
              src="/soi-logo.jpg"
              alt="School of Innovation Logo"
              className="h-8 w-auto object-contain rounded"
            />
          </div>

          <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

          <div>
            <h1 className="font-extrabold text-base md:text-lg text-white tracking-tight leading-snug">
              School of Innovation
            </h1>
            <p className="text-xs text-blue-400 font-semibold">
              Artificial Intelligence and Data Science Vertical
            </p>
          </div>
        </div>

        {/* User Profile & Demo Role Switcher */}
        {user && (
          <div className="flex items-center gap-4">
            {/* Quick Demo Switcher */}
            <div className="hidden lg:flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <span className="text-[11px] font-bold text-zinc-400 px-2.5 uppercase tracking-wider">Role:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => demoLogin("admin")}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    user.role === "admin"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => demoLogin("faculty")}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    user.role === "faculty"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  Faculty
                </button>
                <button
                  onClick={() => demoLogin("student")}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    user.role === "student"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  Student
                </button>
              </div>
            </div>

            {/* Logged User Chip */}
            <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                {getInitials(user.full_name)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-bold text-xs text-white leading-tight">{user.full_name}</div>
                <div className="text-[11px] text-blue-400 font-semibold capitalize">{user.role} Account</div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors border border-transparent hover:border-zinc-800"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Links Strip */}
      {user && (
        <div className="border-t border-zinc-800 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-3 px-4 transition-colors relative flex items-center gap-2 ${
                activeTab === "dashboard"
                  ? "text-blue-400 bg-zinc-900 font-extrabold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard Overview
              {activeTab === "dashboard" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>

            {(user.role === "admin" || user.role === "faculty") && (
              <button
                onClick={() => setActiveTab("datagrid")}
                className={`py-3 px-4 transition-colors relative flex items-center gap-2 ${
                  activeTab === "datagrid"
                    ? "text-blue-400 bg-zinc-900 font-extrabold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                <Database className="w-4 h-4" /> Student Data Matrix
                {activeTab === "datagrid" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            )}

            <button
              onClick={() => setActiveTab("projects")}
              className={`py-3 px-4 transition-colors relative flex items-center gap-2 ${
                activeTab === "projects"
                  ? "text-blue-400 bg-zinc-900 font-extrabold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <FolderGit2 className="w-4 h-4" /> AI Innovation Prototypes
              {activeTab === "projects" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
