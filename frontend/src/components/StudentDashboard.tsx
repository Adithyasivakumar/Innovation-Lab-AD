"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { GraduationCap, Code2, Globe, FileText, Plus, ExternalLink, CheckCircle, Bell, Award, Layers } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export const StudentDashboard: React.FC = () => {
  const { user, token, refreshUser } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Editor state
  const sp = user?.student_profile || {};
  const [githubUrl, setGithubUrl] = useState(sp.github_url || "");
  const [leetcodeUrl, setLeetcodeUrl] = useState(sp.leetcode_url || "");
  const [linkedinUrl, setLinkedinUrl] = useState(sp.linkedin_url || "");
  const [resumeUrl, setResumeUrl] = useState(sp.resume_url || "");
  const [skillsStr, setSkillsStr] = useState(sp.skills?.join(", ") || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // New Prototype Logger Modal
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projMetric, setProjMetric] = useState("");
  const [projTech, setProjTech] = useState("");
  const [projGithub, setProjGithub] = useState("");
  const [projDemo, setProjDemo] = useState("");
  const [creatingProj, setCreatingProj] = useState(false);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const [projRes, annRes] = await Promise.all([
        fetch(`${API_BASE}/projects?batch=${encodeURIComponent(sp.batch || "")}`),
        fetch(`${API_BASE}/announcements`),
      ]);

      if (projRes.ok) {
        const pData = await projRes.json();
        setProjects(pData);
      }
      if (annRes.ok) {
        const aData = await annRes.json();
        setAnnouncements(aData);
      }
    } catch (err) {
      console.error("Error loading student dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sp.id) return;
    setUpdatingProfile(true);
    setProfileMsg("");

    try {
      const skillsArray = skillsStr.split(",").map((s: string) => s.trim()).filter(Boolean);
      const res = await fetch(`${API_BASE}/students/${sp.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          github_url: githubUrl,
          leetcode_url: leetcodeUrl,
          linkedin_url: linkedinUrl,
          resume_url: resumeUrl,
          skills: skillsArray,
        }),
      });

      if (res.ok) {
        setProfileMsg("Profile updated successfully!");
        await refreshUser();
      } else {
        setProfileMsg("Failed to update profile.");
      }
    } catch (err) {
      setProfileMsg("Error updating profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingProj(true);
    try {
      const techArray = projTech.split(",").map((t: string) => t.trim()).filter(Boolean);
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: projTitle,
          description: projDesc,
          accuracy_metric: projMetric,
          tech_stack: techArray,
          github_url: projGithub,
          demo_url: projDemo,
        }),
      });

      if (res.ok) {
        setShowProjectModal(false);
        setProjTitle("");
        setProjDesc("");
        setProjMetric("");
        setProjTech("");
        setProjGithub("");
        setProjDemo("");
        fetchStudentData();
      }
    } catch (err) {
      console.error("Error creating project prototype:", err);
    } finally {
      setCreatingProj(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Student Banner */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" /> KiTE AI & DS Student Hub
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Welcome back, {user?.full_name}!
          </h2>
          <p className="text-sm text-slate-400">
            Assigned Batch: <span className="text-emerald-400 font-semibold">{sp.batch || "AI & DS Batch"}</span> • Roll No: <span className="font-mono text-slate-200">{sp.roll_number}</span>
          </p>
        </div>

        <button
          onClick={() => setShowProjectModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" /> Log AI/DS Prototype Project
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Personal Portfolio & Profile Update */}
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-5 h-5 text-cyan-400" /> Personal Portfolio & Links
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-slate-300" /> GitHub Profile URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-400" /> LeetCode Profile URL
              </label>
              <input
                type="url"
                value={leetcodeUrl}
                onChange={(e) => setLeetcodeUrl(e.target.value)}
                placeholder="https://leetcode.com/username"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" /> LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Resume Link / Upload URL
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">My Core Skills (Comma Separated)</label>
              <textarea
                rows={2}
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="PyTorch, TensorFlow, NLP, Computer Vision..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {profileMsg && (
              <p className="text-xs font-semibold text-emerald-400 text-center">{profileMsg}</p>
            )}

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition shadow-md"
            >
              {updatingProfile ? "Saving Links..." : "Update My Portfolio Links"}
            </button>
          </form>
        </div>

        {/* Right Col: Announcements + Projects */}
        <div className="space-y-6 lg:col-span-2">
          {/* Lab Announcements */}
          <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400 animate-bounce" /> General Lab Announcements
            </h3>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-amber-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-base">{ann.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ann.priority === "Urgent"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : ann.priority === "High"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {ann.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span>Target: {ann.target_batch}</span>
                    <span>Posted by {ann.author_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logged AI/DS Prototype Projects Showcase */}
          <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Batch Innovation Prototypes & Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                        {proj.batch}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          proj.status === "Verified"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base leading-snug">{proj.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3">{proj.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {proj.accuracy_metric && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Metric Result:</span>
                        <span className="font-extrabold text-emerald-400">{proj.accuracy_metric}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {proj.tech_stack?.map((t: string) => (
                        <span key={t} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-1 text-xs">
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          <GithubIcon className="w-3.5 h-3.5" /> Code Repo
                        </a>
                      )}
                      {proj.demo_url && (
                        <a
                          href={proj.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-violet-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log Prototype Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Log AI & DS Prototype Project
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="e.g. YOLOv8 Automated Defect Inspector"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Describe your architecture, data pipeline, and real-world deployment..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Accuracy / Metric Result</label>
                  <input
                    type="text"
                    value={projMetric}
                    onChange={(e) => setProjMetric(e.target.value)}
                    placeholder="e.g. 96.4% F1-score"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tech Stack (Comma Separated)</label>
                  <input
                    type="text"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    placeholder="PyTorch, FastAPI, React"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={projGithub}
                    onChange={(e) => setProjGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={projDemo}
                    onChange={(e) => setProjDemo(e.target.value)}
                    placeholder="https://demo.kite.ac.in/..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProj}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold shadow-lg"
                >
                  {creatingProj ? "Saving..." : "Submit Prototype"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
