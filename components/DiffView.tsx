
"use client";

import clsx from "clsx";

type DiffViewProps = {
  left?: string;   // content of file A
  right?: string;  // content of file B
  titleLeft?: string;
  titleRight?: string;
};

export default function DiffView({ left = "", right = "", titleLeft = "File A", titleRight = "File B" }: DiffViewProps) {
  const leftLines = left.split(/\r?\n/);
  const rightLines = right.split(/\r?\n/);
  const max = Math.max(leftLines.length, rightLines.length);

  // simple line-by-line signal; plug your real diff here when ready
  const rows = Array.from({ length: max }).map((_, i) => {
    const L = leftLines[i] ?? "";
    const R = rightLines[i] ?? "";
    const changed = L !== R;
    return { L, R, changed, i };
  });

  return (
    <section className="mx-auto max-w-7xl px-4 mt-6">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-card overflow-hidden">
        <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50">
          <div className="px-3 py-2 text-sm font-medium text-gray-700">{titleLeft}</div>
          <div className="px-3 py-2 text-sm font-medium text-gray-700 border-l border-gray-200">
            {titleRight}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="max-h-[55vh] overflow-auto">
            {rows.map((row) => (
              <pre
                key={`L-${row.i}`}
                className={clsx(
                  "px-3 py-1 text-sm whitespace-pre-wrap border-b border-gray-100",
                  row.changed && "bg-red-50"
                )}
              >
                {row.L}
              </pre>
            ))}
          </div>
          <div className="max-h-[55vh] overflow-auto border-l border-gray-200">
            {rows.map((row) => (
              <pre
                key={`R-${row.i}`}
                className={clsx(
                  "px-3 py-1 text-sm whitespace-pre-wrap border-b border-gray-100",
                  row.changed && "bg-green-50"
                )}
              >
                {row.R}
              </pre>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
