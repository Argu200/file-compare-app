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
    <div>
      <p>Select two files:</p>
      <input type="file" multiple onChange={handleFileChange} />
    </div>
  );
}
