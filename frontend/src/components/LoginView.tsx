"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Shield, Users, GraduationCap, ArrowRight, Lock, Mail, Award, CheckCircle2, Sparkles } from "lucide-react";

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
      setError("Invalid credentials. Please check your institutional email and password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between antialiased">
      {/* College Institutional Banner Header */}
      <header className="bg-[#0b132b] text-white py-4 px-6 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black text-xl px-3.5 py-1.5 rounded-xl shadow-md border border-blue-500/40 tracking-wider">
              KiTE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-white leading-tight tracking-tight">
                  KGiSL Institute of Technology
                </h1>
                <span className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" /> NAAC A Grade
                </span>
              </div>
              <p className="text-xs text-slate-400">Department of Artificial Intelligence & Data Science</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Top Header Card */}
          <div className="bg-[#0b132b] text-white p-7 text-center space-y-1.5 border-b border-slate-800">
            <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-2 text-blue-400 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Innovation Lab Portal Login</h2>
            <p className="text-xs text-slate-400">Secure institutional authentication for AI & DS department</p>
          </div>

          {/* Form Content */}
          <div className="p-7 space-y-6">
            {/* Role Tab Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("admin")}
                  className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    selectedRole === "admin"
                      ? "bg-[#0b132b] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("faculty")}
                  className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    selectedRole === "faculty"
                      ? "bg-[#0b132b] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" /> Faculty
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("student")}
                  className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    selectedRole === "student"
                      ? "bg-[#0b132b] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Student
                </button>
              </div>
            </div>

            {/* Login Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ent-input pl-10"
                    placeholder="name@kite.ac.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ent-input pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold text-center text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs font-bold gap-2"
              >
                {loading ? "Authenticating..." : "Sign In to Portal"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Demo One-Click Access */}
            <div className="pt-5 border-t border-slate-200 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-wider">
                Instant Demo Access
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => demoLogin("admin")}
                  className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition border border-slate-200 text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin("faculty")}
                  className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition border border-slate-200 text-center"
                >
                  Faculty
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin("student")}
                  className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition border border-slate-200 text-center"
                >
                  Student
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b132b] text-slate-400 py-4 text-center text-xs border-t border-slate-800">
        <p>© 2026 KGiSL Institute of Technology (KiTE). All rights reserved.</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Thudiyalur Road, Saravanampatti, Coimbatore – 641035</p>
      </footer>
    </div>
  );
};
