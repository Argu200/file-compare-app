
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DocumentArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type Props = {
  accept?: string;                        // e.g. ".txt,.csv,.json"
  onChange: (files: { a: File | null; b: File | null }) => void;
  initialA?: File | null;
  initialB?: File | null;
};

export default function FileUploader({ accept = ".txt,.csv,.json", onChange, initialA = null, initialB = null }: Props) {
  const [fileA, setFileA] = useState<File | null>(initialA);
  const [fileB, setFileB] = useState<File | null>(initialB);

  useEffect(() => onChange({ a: fileA, b: fileB }), [fileA, fileB, onChange]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DropZone label="File A" accept={accept} value={fileA} onChange={setFileA} />
      <DropZone label="File B" accept={accept} value={fileB} onChange={setFileB} />
    </section>
  );
}

/* ---------- DropZone (internal) ---------- */

function DropZone({
  label,
  accept,
  onChange,
  value,
}: {
  label: string;
  accept?: string;
  onChange: (f: File | null) => void;
  value?: File | null;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAllowed = (file: File) =>
    !accept || accept.split(",").some((ext) => file.name.toLowerCase().endsWith(ext.trim()));

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      if (!isAllowed(file)) {
        alert(`Unsupported file type. Allowed: ${accept}`);
        return;
      }
      onChange(file);
    },
    [accept, onChange]
  );

  const onBrowse = useCallback(() => inputRef.current?.click(), []);

  // prevent browser from opening the file on window when dropping outside
  useEffect(() => {
    const preventDefaults = (e: Event) => e.preventDefault();
    document.addEventListener("dragover", preventDefaults);
    document.addEventListener("drop", preventDefaults);
    return () => {
      document.removeEventListener("dragover", preventDefaults);
      document.removeEventListener("drop", preventDefaults);
    };
  }, []);

  return (
    <div
      onDragEnter={() => setDragOver(true)}
      onDragLeave={() => setDragOver(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={clsx(
        "group relative rounded-xl border border-gray-200 bg-white shadow-card transition",
        dragOver ? "ring-2 ring-brand-600 ring-offset-2" : "hover:shadow-lg"
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900">{label}</p>
          {value && (
            <button
              type="button"
              className="focus-ring inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
              onClick={() => onChange(null)}
              aria-label={`Remove ${label} file`}
            >
              <XMarkIcon className="w-4 h-4" />
              <span className="sr-only">Remove file</span>
            </button>
          )}
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={onBrowse}
          onKeyDown={(e) => e.key === "Enter" && onBrowse()}
          className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center cursor-pointer focus-ring"
          aria-label={`${label}: browse or drop a file`}
        >
          <DocumentArrowUpIcon className="w-9 h-9 text-brand-600" />
          {!value ? (
            <>
              <p className="mt-2 text-sm text-gray-700">
                Drag and drop a file here, or <span className="text-brand-700 font-medium">browse</span>
              </p>
              {accept && <p className="mt-1 text-xs text-gray-500">Allowed: {accept}</p>}
            </>
          ) : (
            <div className="mt-2 max-w-full truncate text-sm text-gray-700">
              {value.name} <span className="text-gray-500">({Math.round(value.size / 1024)} KB)</span>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}
