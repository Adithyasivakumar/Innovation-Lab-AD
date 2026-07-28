"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Cpu, Shield, Users, GraduationCap, ArrowRight, Lock, Mail } from "lucide-react";

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
      setError("Invalid credentials. Try demo preset buttons below!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090d16] relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 rounded-2xl shadow-xl shadow-cyan-500/20 mb-2">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            KiTE <span className="gradient-text-kite">AI & DS</span> Portal
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            KGiSL Institute of Technology • Innovation Lab Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-6 shadow-2xl">
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleRoleSelect("admin")}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition ${
                selectedRole === "admin"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
            <button
              onClick={() => handleRoleSelect("faculty")}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition ${
                selectedRole === "faculty"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Faculty
            </button>
            <button
              onClick={() => handleRoleSelect("student")}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition ${
                selectedRole === "student"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Student
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-400 font-semibold text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition active:scale-95"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Cards */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block text-center uppercase tracking-wider">
              One-Click Demo Instant Logins
            </span>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <button
                onClick={() => demoLogin("admin")}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 font-semibold text-center transition"
              >
                Admin Superuser
              </button>
              <button
                onClick={() => demoLogin("faculty")}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-violet-300 font-semibold text-center transition"
              >
                Faculty Mentor
              </button>
              <button
                onClick={() => demoLogin("student")}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-300 font-semibold text-center transition"
              >
                Student (SOI)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
