"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Shield, Users, GraduationCap, ArrowRight, Lock, Mail, Award, Building } from "lucide-react";

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
      setEmail("student@kite.ac.in");
      setPassword("student123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await login(email, password);
    if (!success) {
      setError("Invalid credentials. Please check your username and password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between">
      {/* College Institutional Banner Header */}
      <header className="bg-[#0f172a] text-white py-4 px-6 shadow-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-700 text-white font-black text-xl px-3 py-1 rounded-lg tracking-wider">
              KiTE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg leading-tight">KGiSL Institute of Technology</h1>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Award className="w-3 h-3" /> NAAC A Grade
                </span>
              </div>
              <p className="text-xs text-slate-300">Department of Artificial Intelligence and Data Science</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Body */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-[#0f172a] text-white p-6 text-center space-y-1">
            <h2 className="text-xl font-bold">Innovation Lab Portal Login</h2>
            <p className="text-xs text-slate-300">Select your institutional role to access your portal</p>
          </div>

          {/* Role Tabs */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleRoleSelect("admin")}
                className={`py-2 rounded-md flex items-center justify-center gap-1 transition ${
                  selectedRole === "admin"
                    ? "bg-[#0f172a] text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("faculty")}
                className={`py-2 rounded-md flex items-center justify-center gap-1 transition ${
                  selectedRole === "faculty"
                    ? "bg-[#0f172a] text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Faculty
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("student")}
                className={`py-2 rounded-md flex items-center justify-center gap-1 transition ${
                  selectedRole === "student"
                    ? "bg-[#0f172a] text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> Student
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600 font-semibold text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2"
              >
                {loading ? "Authenticating..." : "Sign In to Portal"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* One-Click Quick Login Preset Buttons */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block text-center uppercase tracking-wider">
                Quick Demo Access
              </span>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => demoLogin("admin")}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-center border border-slate-200"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin("faculty")}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-center border border-slate-200"
                >
                  Faculty
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin("student")}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-center border border-slate-200"
                >
                  Student
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 py-4 text-center text-xs border-t border-slate-800">
        <p>© 2026 KGiSL Institute of Technology (KiTE). All rights reserved.</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Thudiyalur Road, Saravanampatti, Coimbatore – 641035</p>
      </footer>
    </div>
  );
};
