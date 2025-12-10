"use client";

import { useState } from "react";

export default function FileUploader({
  onUpload,
  singleFile = false,
}: {
  onUpload: (file: File | File[]) => void;
  singleFile?: boolean;
}) {
  const [files, setFiles] = useState<File[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    if (singleFile) {
      const file = e.target.files[0];
      setFiles([file]);
      onUpload(file);
    } else {
      const selected = Array.from(e.target.files);
      setFiles(selected);
      onUpload(selected);
    }
  }

  return (
    <div className="flex flex-col">
      <input
        type="file"
        onChange={handleFileChange}
        {...(!singleFile ? { multiple: true } : {})}
        className="border border-gray-300 p-2 rounded"
      />
    </div>
  );
}
