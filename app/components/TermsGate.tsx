"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TERMS_COOKIE = "christopher_terms_accepted";
const TERMS_COOKIE_VALUE = "yes";

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
};

const TERMS_PREVIEW = [
  "Christopher AI is a local, self-hosted application.",
  "Profiles require passwords, and chat history is encrypted at rest in browser localStorage.",
  "If browser storage is cleared or a password is lost, chat history may be unrecoverable.",
  "HTTPS is enabled by default on your LAN to protect data in transit.",
  "HTTP fallback exists for compatibility, but it is not encrypted in transit.",
  "The header transport badge shows whether your current session is HTTPS or HTTP.",
  "You are responsible for securing your device, browser, and local network.",
  "AI output may be inaccurate and should not be treated as professional advice.",
  "The software is provided as-is, without warranty.",
];

export default function TermsGate() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasAccepted = getCookie(TERMS_COOKIE) === TERMS_COOKIE_VALUE;
    setAccepted(hasAccepted);
    setChecked(hasAccepted);
  }, []);

  if (!mounted || accepted || pathname === "/terms") return null;

  const handleContinue = () => {
    if (!checked) return;
    setCookie(TERMS_COOKIE, TERMS_COOKIE_VALUE, 365);
    setAccepted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-green-500/30 bg-gray-950 shadow-2xl shadow-black/60">
        <div className="border-b border-green-500/20 px-6 py-5">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Before entering</p>
          <h1 className="mt-2 text-2xl font-bold text-[#00ff88]" style={{ fontFamily: "var(--font-orbitron), sans-serif" }}>
            Terms & Conditions
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Review the summary below, open the full terms if needed, then accept to continue.
          </p>
        </div>

        <div className="space-y-5 px-6 py-5 text-sm text-gray-300">
          <div className="max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-black/50 p-4 leading-relaxed">
            <div className="space-y-3">
              <p className="text-gray-200">
                By using Christopher AI, you agree to the following summary of terms:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-gray-400">
                {TERMS_PREVIEW.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
            <Link
              href="/terms"
              className="text-sm font-medium text-green-400 underline decoration-green-500/40 underline-offset-4 hover:text-green-300"
            >
              Read the full terms page
            </Link>
            <span className="text-xs text-gray-500">Scrollable preview is intentionally abbreviated.</span>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-600 bg-black text-[#00ff88] focus:ring-[#00ff88]"
            />
            <span>I have read and accept the Terms & Conditions.</span>
          </label>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!checked}
              className="rounded-lg border border-green-500/50 bg-green-500/15 px-5 py-2.5 text-sm font-semibold text-green-300 transition-all hover:bg-green-500/25 disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-500"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}