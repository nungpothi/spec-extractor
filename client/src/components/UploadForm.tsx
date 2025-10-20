import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState<string>('TEMP-PJ-001');
  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      Swal.fire({ icon: 'error', title: 'No file', text: 'Please choose an Excel file.' });
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('projectId', projectId);

    try {
      setIsUploading(true);
      const res = await fetch('/api/spec/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || 'Upload failed');
      }
      Swal.fire({
        icon: 'success',
        title: 'Upload started',
        text: `Upload ID: ${data.uploadId}\nProject: ${data.projectId}`,
      });
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: err?.message || 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <label className="form-label">Project ID (optional)</label>
      <input
        className="input"
        type="text"
        placeholder="TEMP-PJ-001"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
      />

      <label className="form-label">Choose Excel file</label>
      <input
        className="input"
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button className="button" type="submit" disabled={isUploading}>
        {isUploading ? 'Uploading…' : 'Upload'}
      </button>

      <div className="progress-placeholder">
        {isUploading ? 'Processing started… (mock) 🌀' : 'Ready to upload'}
      </div>
    </form>
  );
}

