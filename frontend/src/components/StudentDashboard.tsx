"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { GraduationCap, Code2, Globe, FileText, Plus, ExternalLink, CheckCircle, Bell, Award, Layers, UserCheck } from "lucide-react";
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
      {/* Student Banner Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            <GraduationCap className="w-3.5 h-3.5" /> Student Personal Workspace
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Welcome, {user?.full_name}
          </h2>
          <p className="text-xs text-slate-600">
            Roll Number: <span className="font-mono font-bold text-slate-800">{sp.roll_number}</span> • Assigned Batch: <span className="font-semibold text-blue-800">{sp.batch}</span>
          </p>
        </div>

        <button
          onClick={() => setShowProjectModal(true)}
          className="btn-kite-primary text-xs flex items-center justify-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" /> Log AI/DS Prototype Project
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: My Portfolio & Links */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5 lg:col-span-1">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-700" /> My Profile & Links
            </h3>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Editable
            </span>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-slate-700" /> GitHub Profile
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="kite-input w-full"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-600" /> LeetCode Profile
              </label>
              <input
                type="url"
                value={leetcodeUrl}
                onChange={(e) => setLeetcodeUrl(e.target.value)}
                placeholder="https://leetcode.com/username"
                className="kite-input w-full"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" /> LinkedIn Profile
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="kite-input w-full"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Resume Drive Link
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="kite-input w-full"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">My Core Skills (Comma Separated)</label>
              <textarea
                rows={2}
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="PyTorch, TensorFlow, Computer Vision, FastAPI..."
                className="kite-input w-full"
              />
            </div>

            {profileMsg && (
              <p className="text-xs font-bold text-emerald-700 text-center bg-emerald-50 py-1.5 rounded border border-emerald-200">
                {profileMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition"
            >
              {updatingProfile ? "Saving Links..." : "Save My Portfolio Links"}
            </button>
          </form>
        </div>

        {/* Right Column: Submitted Projects & Announcements */}
        <div className="space-y-6 lg:col-span-2">
          {/* Announcements Feed */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="w-4 h-4 text-amber-600" /> Lab Notices & Department Announcements
            </h3>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      {ann.priority} Notice
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{ann.content}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Target Batch: {ann.target_batch}</span>
                    <span>Posted by {ann.author_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logged Prototype Showcase */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-blue-700" /> My AI & DS Project Prototypes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length === 0 ? (
                <p className="text-xs text-slate-500 col-span-2 text-center py-4">
                  No logged project prototypes yet. Click "Log AI/DS Prototype Project" to submit your model.
                </p>
              ) : (
                projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {proj.batch}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
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
                          <span className="text-slate-500 font-medium">Accuracy Metric:</span>
                          <span className="font-bold text-blue-800">{proj.accuracy_metric}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {proj.tech_stack?.map((t: string) => (
                          <span key={t} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 pt-1 text-xs">
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
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Submit New AI & DS Prototype Model
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="e.g. Defect Inspector Model"
                  className="kite-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Describe your model architecture, datasets, and prototype features..."
                  className="kite-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Accuracy / Metric Result</label>
                  <input
                    type="text"
                    value={projMetric}
                    onChange={(e) => setProjMetric(e.target.value)}
                    placeholder="e.g. 96.5% F1-score"
                    className="kite-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tech Stack (Comma Separated)</label>
                  <input
                    type="text"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    placeholder="PyTorch, OpenCV, FastAPI"
                    className="kite-input w-full"
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
                    className="kite-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={projDemo}
                    onChange={(e) => setProjDemo(e.target.value)}
                    placeholder="https://demo.kite.ac.in/..."
                    className="kite-input w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="btn-kite-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProj}
                  className="btn-kite-primary text-xs"
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
