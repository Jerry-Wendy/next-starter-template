"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white print:hidden"
    >
      Print / Save PDF
    </button>
  );
}
