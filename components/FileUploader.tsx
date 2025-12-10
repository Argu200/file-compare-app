"use client";

import { useState } from "react";

export default function FileUploader({ onUpload }: { onUpload: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles(selected);
    onUpload(selected);
  }

  return (
    <div className="flex flex-col">
      <label className="mb-2 font-medium">Upload exactly 2 files:</label>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="border border-gray-300 p-2 rounded"
      />
    </div>
  );
}
