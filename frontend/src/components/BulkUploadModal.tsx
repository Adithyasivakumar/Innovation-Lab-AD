"use client";

import React, { useState } from "react";
import { API_BASE, useAuth } from "@/context/AuthContext";
import { Upload, X, CheckCircle, AlertCircle, FileSpreadsheet } from "lucide-react";

interface BulkUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ onClose, onSuccess }) => {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ created: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResultMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/students/bulk-upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setResultMsg({ created: data.created_count, errors: data.errors || [] });
        onSuccess();
      } else {
        setResultMsg({ created: 0, errors: [data.detail || "Upload failed"] });
      }
    } catch (err: any) {
      setResultMsg({ created: 0, errors: ["Network error during upload."] });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-card bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-400" /> Bulk Import Students (CSV / Excel)
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Upload a CSV or Excel file containing student records. Expected column headers:
            <span className="block font-mono bg-slate-950 p-2 rounded-lg text-cyan-300 mt-1 border border-slate-800">
              full_name, email, roll_number, batch, placement_status, company_name, package_lpa, skills
            </span>
          </p>

          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-6 text-center space-y-2 bg-slate-950/40">
            <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-400" />
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
              id="bulk-file-input"
            />
            <label
              htmlFor="bulk-file-input"
              className="cursor-pointer text-cyan-400 hover:underline font-bold block"
            >
              {file ? file.name : "Click to select CSV/Excel file"}
            </label>
            <span className="text-slate-500 text-[10px]">Supports .csv, .xlsx up to 10MB</span>
          </div>

          {resultMsg && (
            <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
              {resultMsg.created > 0 && (
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4" /> Successfully created {resultMsg.created} student records!
                </div>
              )}
              {resultMsg.errors.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <AlertCircle className="w-4 h-4" /> Warnings / Errors:
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-400 max-h-32 overflow-y-auto">
                    {resultMsg.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs"
          >
            Close
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold text-xs shadow-lg disabled:opacity-50"
          >
            {uploading ? "Importing..." : "Start Bulk Import"}
          </button>
        </div>
      </div>
    </div>
  );
};
