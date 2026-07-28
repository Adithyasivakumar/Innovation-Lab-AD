"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { LoginView } from "@/components/LoginView";
import { AdminDashboard } from "@/components/AdminDashboard";
import { FacultyDashboard } from "@/components/FacultyDashboard";
import { StudentDashboard } from "@/components/StudentDashboard";
import { DataGrid } from "@/components/DataGrid";
import { BulkUploadModal } from "@/components/BulkUploadModal";

export default function Home() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-cyan-400 font-mono">
        Loading KiTE Portal...
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {activeTab === "dashboard" && (
          <>
            {user.role === "admin" && (
              <AdminDashboard
                onOpenBulkUpload={() => setShowBulkModal(true)}
                onNavigateDataGrid={() => setActiveTab("datagrid")}
              />
            )}
            {user.role === "faculty" && <FacultyDashboard />}
            {user.role === "student" && <StudentDashboard />}
          </>
        )}

        {activeTab === "datagrid" && <DataGrid />}

        {activeTab === "projects" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">KiTE AI & DS Lab Innovation Projects</h2>
            <p className="text-sm text-slate-400">
              Showcase of cutting-edge AI, Machine Learning, Deep Learning, and Computer Vision prototypes built by students across 3 batches.
            </p>
            {user.role === "student" ? (
              <StudentDashboard />
            ) : user.role === "faculty" ? (
              <FacultyDashboard />
            ) : (
              <AdminDashboard
                onOpenBulkUpload={() => setShowBulkModal(true)}
                onNavigateDataGrid={() => setActiveTab("datagrid")}
              />
            )}
          </div>
        )}
      </main>

      {/* Bulk CSV Upload Modal */}
      {showBulkModal && (
        <BulkUploadModal
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => setShowBulkModal(false)}
        />
      )}
    </div>
  );
}
