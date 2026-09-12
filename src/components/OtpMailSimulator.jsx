import React, { useState } from 'react';

export default function OtpMailSimulator({ email, otp, onCopyCode, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!otp) return null;

  const handleCopy = () => {
    onCopyCode(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-md w-[calc(100vw-2rem)] animate-in slide-in-from-top-4 duration-300">
      <div className="rounded-2xl border border-cyan-500/30 bg-[#0d131f]/95 text-white p-4 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        
        {/* Email Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-black text-sm">
              ✉️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-cyan-300">Gagan Mobile Care Auth</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded-full font-mono">Mail Delivery</span>
              </div>
              <p className="text-[11px] text-gray-400">To: {email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
            title="Dismiss notification"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Email Content Snippet */}
        <div className="py-3">
          <p className="text-xs text-gray-300 font-medium">
            Your single-use 6-digit verification code is:
          </p>
          <div className="my-2.5 flex items-center justify-between bg-black/60 rounded-xl px-4 py-2.5 border border-cyan-500/20">
            <span className="font-mono text-2xl font-black tracking-widest text-cyan-400 selection:bg-cyan-500 selection:text-black">
              {otp}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs bg-cyan-400 hover:bg-cyan-300 text-black px-3 py-1.5 rounded-lg font-bold transition-all shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Copied!' : 'Auto-Fill'}
            </button>
          </div>
          <p className="text-[10px] text-gray-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px] text-amber-400">schedule</span>
            Valid for 5 minutes. Please do not share this OTP with anyone.
          </p>
        </div>
      </div>
    </div>
  );
}
