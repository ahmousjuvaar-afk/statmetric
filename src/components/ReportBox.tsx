import { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

interface ReportBoxProps {
  apaString: string;
  contextNote?: string;
}

export function ReportBox({
  apaString,
  contextNote = 'Formatted according to APA 7th Edition reporting guidelines for scientific manuscripts and lab reports.',
}: ReportBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apaString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 tracking-wide uppercase">
          <FileText className="w-3.5 h-3.5" />
          <span>Report-Ready Result (APA 7th)</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md transition-colors"
          aria-label="Copy report-ready result"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy text</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-slate-950/70 rounded-lg p-3.5 border border-slate-800 font-mono text-sm sm:text-base text-slate-100 select-all">
        {apaString}
      </div>

      <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
        {contextNote}
      </p>
    </div>
  );
}
