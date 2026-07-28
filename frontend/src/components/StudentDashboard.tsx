"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { GraduationCap, Code2, Globe, FileText, Plus, ExternalLink, CheckCircle, Bell, Award, Layers, UserCheck, FolderGit2 } from "lucide-react";
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
      {/* Top Jet Black Banner */}
      <div className="bg-black text-white rounded-xl p-6 sm:p-7 shadow-xs border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/80">
            <GraduationCap className="w-3.5 h-3.5" /> Student Personal Portal
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Welcome, {user?.full_name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-semibold">
            <span>Roll No: <strong className="font-mono text-white">{sp.roll_number || "N/A"}</strong></span>
            <span>•</span>
            <span>Batch: <strong className="text-white">{sp.batch || "AI & DS"}</strong></span>
            <span>•</span>
            <span>Department: <strong className="text-white">{sp.department || "AI & DS"}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-center min-w-28">
            <div className="text-xs text-zinc-400 font-bold uppercase">Attendance</div>
            <div className="text-xl font-extrabold text-blue-400">{sp.attendance_pct || 90}%</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-center min-w-28">
            <div className="text-xs text-zinc-400 font-bold uppercase">Placement</div>
            <div className="text-sm font-extrabold text-white">{sp.placement_status || "Unplaced"}</div>
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic Links & AI Prototypes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio Links Card */}
          <div className="ent-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-extrabold text-black text-base">Portfolio & Online Handles</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Maintain your verified links for faculty placement review</p>
              </div>
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">GitHub Profile URL</label>
                  <div className="relative">
                    <GithubIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="ent-input pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">LeetCode Profile URL</label>
                  <div className="relative">
                    <Code2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="url"
                      value={leetcodeUrl}
                      onChange={(e) => setLeetcodeUrl(e.target.value)}
                      placeholder="https://leetcode.com/username"
                      className="ent-input pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">LinkedIn Profile URL</label>
                  <div className="relative">
                    <LinkedinIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="ent-input pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">Resume Link (Drive/PDF)</label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="url"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/your-resume"
                      className="ent-input pl-9"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Technical Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="Python, PyTorch, RAG Pipelines, FastApi, OpenCV..."
                  className="ent-input"
                />
              </div>

              {profileMsg && (
                <div className="p-2.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                  {profileMsg}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="btn-primary text-xs font-bold"
                >
                  {updatingProfile ? "Saving Portfolio..." : "Update Portfolio Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* AI Prototypes Card */}
          <div className="ent-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-extrabold text-black text-base">My AI Innovation Prototypes</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Submit models for faculty lab verification</p>
              </div>
              <button
                onClick={() => setShowProjectModal(true)}
                className="btn-primary text-xs gap-1.5 font-bold"
              >
                <Plus className="w-4 h-4" /> Submit New Prototype
              </button>
            </div>

            <div className="space-y-3">
              {projects.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No AI prototype models logged yet.</p>
              ) : (
                projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-black text-sm">{proj.title}</h4>
                        <p className="text-xs text-slate-700 mt-0.5">{proj.description}</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${
                        proj.status === "Verified"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {proj.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {proj.tech_stack?.map((tech: string, idx: number) => (
                          <span key={idx} className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded border border-slate-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline font-bold flex items-center gap-1"
                        >
                          Repo Link <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Notices */}
        <div className="space-y-6">
          <div className="ent-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-black text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" /> Department Notices
              </h3>
              <span className="text-[11px] font-bold bg-black text-white px-2 py-0.5 rounded">
                AI & DS Vertical
              </span>
            </div>

            <div className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No notices posted.</p>
              ) : (
                announcements.map((ann) => (
                  <div key={ann.id} className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-black">{ann.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ann.priority === "Urgent" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {ann.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{ann.content}</p>
                    <div className="text-[10px] text-slate-500 font-mono font-semibold pt-1">
                      Target: {ann.target_batch}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SUBMIT PROTOTYPE MODAL */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-black text-base border-b border-slate-200 pb-3">
              Log AI/DS Innovation Prototype
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="e.g. Autonomous Vision Inspection System"
                  className="ent-input"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Summarize model architecture, dataset, and impact..."
                  className="ent-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Accuracy / Metric</label>
                  <input
                    type="text"
                    value={projMetric}
                    onChange={(e) => setProjMetric(e.target.value)}
                    placeholder="e.g. 96.4% F1-Score"
                    className="ent-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Tech Stack (Comma Separated)</label>
                  <input
                    type="text"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    placeholder="Python, PyTorch, OpenCV"
                    className="ent-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">GitHub Repository Link</label>
                <input
                  type="url"
                  value={projGithub}
                  onChange={(e) => setProjGithub(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="ent-input"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Live Demo Link (Optional)</label>
                <input
                  type="url"
                  value={projDemo}
                  onChange={(e) => setProjDemo(e.target.value)}
                  placeholder="https://demo.kgkite.ac.in"
                  className="ent-input"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
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
                  {creatingProj ? "Submitting..." : "Submit for Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
