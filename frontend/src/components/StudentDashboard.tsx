"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { GraduationCap, Code2, Globe, FileText, Plus, ExternalLink, CheckCircle, Bell, Award, Layers, UserCheck, Sparkles, FolderGit2 } from "lucide-react";
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
      console.error("Error loading student data:", err);
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
        setProfileMsg("Portfolio links updated successfully!");
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
      console.error("Error logging project prototype:", err);
    } finally {
      setCreatingProj(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Hero Card */}
      <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#1e3a8a] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30 shadow-xs">
            <GraduationCap className="w-4 h-4 text-blue-400" /> Student Personal Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome, {user?.full_name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
            <span>Roll No: <strong className="font-mono text-white">{sp.roll_number}</strong></span>
            <span>•</span>
            <span>Batch: <strong className="text-amber-300">{sp.batch}</strong></span>
            <span>•</span>
            <span>Attendance: <strong className="text-emerald-400">{sp.attendance_pct || 94}%</strong></span>
          </div>
        </div>

        <button
          onClick={() => setShowProjectModal(true)}
          className="btn-primary z-10 text-xs font-bold shadow-lg gap-2"
        >
          <Plus className="w-4 h-4" /> Log AI/DS Prototype Project
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Portfolio & Skill Editor */}
        <div className="ent-card p-6 space-y-6 lg:col-span-1">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" /> My Profile & Portfolio Links
            </h3>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
              Editable
            </span>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-slate-800" /> GitHub Profile URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="ent-input"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-600" /> LeetCode Profile URL
              </label>
              <input
                type="url"
                value={leetcodeUrl}
                onChange={(e) => setLeetcodeUrl(e.target.value)}
                placeholder="https://leetcode.com/username"
                className="ent-input"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" /> LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="ent-input"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Google Drive Resume URL
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="ent-input"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Technical Skills (Comma Separated)</label>
              <textarea
                rows={2}
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="PyTorch, OpenCV, FastAPI, Pandas..."
                className="ent-input"
              />
            </div>

            {profileMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-center text-xs">
                {profileMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={updatingProfile}
              className="btn-primary w-full py-2.5 font-bold"
            >
              {updatingProfile ? "Saving Links..." : "Save My Portfolio Links"}
            </button>
          </form>
        </div>

        {/* Right Column: Notices & Prototypes */}
        <div className="space-y-6 lg:col-span-2">
          {/* Department Announcements Feed */}
          <div className="ent-card p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="w-4 h-4 text-amber-500" /> Department Notices & Announcements
            </h3>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {ann.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{ann.content}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                    <span>Target: {ann.target_batch}</span>
                    <span>Posted by {ann.author_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logged Prototype Showcase */}
          <div className="ent-card p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <FolderGit2 className="w-4 h-4 text-blue-600" /> My AI & DS Project Prototypes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length === 0 ? (
                <p className="text-xs text-slate-500 col-span-2 text-center py-6">
                  No logged project prototypes found. Click "Log AI/DS Prototype Project" above to submit your model.
                </p>
              ) : (
                projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="badge-batch">{proj.batch}</span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            proj.status === "Verified"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      {proj.accuracy_metric && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Metric Result:</span>
                          <span className="font-bold text-blue-700">{proj.accuracy_metric}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {proj.tech_stack?.map((t: string) => (
                          <span key={t} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 pt-2 text-xs">
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-blue-700 font-bold hover:underline flex items-center gap-1">
                            <GithubIcon className="w-3.5 h-3.5" /> Repository
                          </a>
                        )}
                        {proj.demo_url && (
                          <a href={proj.demo_url} target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log Prototype Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Submit AI & DS Prototype Model
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="e.g. Defect Detection Vision Model"
                  className="ent-input"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Describe your model architecture, dataset size, and prototype results..."
                  className="ent-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Accuracy / Metric Result</label>
                  <input
                    type="text"
                    value={projMetric}
                    onChange={(e) => setProjMetric(e.target.value)}
                    placeholder="e.g. 96.4% F1-Score"
                    className="ent-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tech Stack (Comma Separated)</label>
                  <input
                    type="text"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    placeholder="PyTorch, OpenCV, FastAPI"
                    className="ent-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={projGithub}
                    onChange={(e) => setProjGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="ent-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={projDemo}
                    onChange={(e) => setProjDemo(e.target.value)}
                    placeholder="https://demo.kite.ac.in/..."
                    className="ent-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProj}
                  className="btn-primary text-xs"
                >
                  {creatingProj ? "Submitting..." : "Submit Prototype"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
