"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Shield, Users, GraduationCap, ArrowRight, Lock, Mail } from "lucide-react";

export const LoginView: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"admin" | "faculty" | "student">("admin");
  const [email, setEmail] = useState("admin@kite.ac.in");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: "admin" | "faculty" | "student") => {
    setSelectedRole(role);
    setError("");
    if (role === "admin") {
      setEmail("admin@kite.ac.in");
      setPassword("admin123");
    } else if (role === "faculty") {
      setEmail("faculty1@kite.ac.in");
      setPassword("faculty123");
    } else {
      setEmail("23aia09anushwathi@soi.kgkite.ac.in");
      setPassword("student123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await login(email, password);
    if (!success) {
      setError("Invalid credentials. Please verify your email and password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between antialiased">
      {/* Top Corporate Institutional Header */}
      <header className="bg-[#0f172a] text-white py-3.5 px-6 shadow-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-auto bg-white p-1 rounded-lg border border-slate-700 shadow-sm flex items-center justify-center shrink-0">
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
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Card Banner */}
          <div className="bg-[#0f172a] text-white p-6 text-center space-y-2 border-b border-slate-800">
            <div className="h-12 w-auto inline-flex items-center justify-center bg-white p-1.5 rounded-lg border border-slate-700 shadow-sm mb-1">
              <img
                src="/soi-logo.jpg"
                alt="School of Innovation Logo"
                className="h-9 w-auto object-contain rounded"
              />
            </div>
            <h2 className="text-lg font-bold tracking-tight">AI & DS Vertical Innovation Portal</h2>
            <p className="text-xs text-slate-400">Institutional Role Authentication</p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            {/* Role Tab Selector */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Select Portal Access Role
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("admin")}
                  className={`py-2 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                    selectedRole === "admin"
                      ? "bg-[#0f172a] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("faculty")}
                  className={`py-2 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                    selectedRole === "faculty"
                      ? "bg-[#0f172a] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" /> Faculty
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("student")}
                  className={`py-2 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                    selectedRole === "student"
                      ? "bg-[#0f172a] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Student
                </button>
              </div>
            </div>

            {/* Inputs */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ent-input pl-9"
                    placeholder="name@soi.kgkite.ac.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ent-input pl-9"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium text-center text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs font-semibold gap-1.5 shadow-xs"
              >
                {loading ? "Authenticating..." : "Sign In to Portal"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Role Switching */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 block text-center uppercase tracking-wider">
                Quick Demo Login Switcher
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => demoLogin("admin")}
                  className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md transition border border-slate-200 text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin("faculty")}
                  className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md transition border border-slate-200 text-center"
                >
                  Faculty
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin("student")}
                  className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md transition border border-slate-200 text-center"
                >
                  Student
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-slate-400 py-3 text-center text-xs border-t border-slate-800">
        <p>© 2026 School of Innovation (SoI) • AI & DS Vertical</p>
        <p className="text-[11px] text-slate-500 mt-0.5">KGiSL Institute of Technology, Coimbatore – 641035</p>
      </footer>
    </div>
  );
};
