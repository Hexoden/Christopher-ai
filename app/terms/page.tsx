"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="h-screen overflow-y-scroll bg-gray-950 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-md border border-green-500/20 p-8 rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="mb-8 border-b border-green-500/30 pb-6">
          <h1 className="text-4xl font-bold font-heading text-[#00ff88] mb-2" style={{ fontFamily: "var(--font-orbitron), sans-serif", textShadow: '0 0 15px rgba(0,255,136,0.4)' }}>
            TERMS & CONDITIONS
          </h1>
          <p className="text-gray-400 text-sm font-mono">Last Updated: April 4, 2026 • Version 1.2</p>
        </div>
        
        {/* Content Body */}
        <div className="space-y-8 text-gray-300 leading-relaxed text-sm md:text-base">

          {/* Quick Start */}
          <section>
            <h2 className="text-xl font-bold text-green-400 mb-3 font-heading">QUICK START (RECOMMENDED)</h2>
            <p className="mb-3 text-gray-300">
              Run one setup command on your host, then open the printed secure LAN URL.
              Visual loader scripts are recommended for a cleaner setup experience.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-black/60 border border-green-500/30 p-4 rounded-lg">
                <h4 className="text-green-400 font-bold mb-2 text-sm font-heading">Linux</h4>
                <pre className="text-xs text-gray-300 bg-black/70 border border-white/10 rounded p-3 overflow-x-auto">chmod +x ./setup-ui.sh{"\n"}./setup-ui.sh</pre>
              </div>
              <div className="bg-black/60 border border-green-500/30 p-4 rounded-lg">
                <h4 className="text-green-400 font-bold mb-2 text-sm font-heading">macOS</h4>
                <pre className="text-xs text-gray-300 bg-black/70 border border-white/10 rounded p-3 overflow-x-auto">chmod +x ./setup-ui.sh{"\n"}./setup-ui.sh{"\n"}# if needed:{"\n"}./setup-ui.sh &lt;host-ip&gt;</pre>
              </div>
              <div className="bg-black/60 border border-green-500/30 p-4 rounded-lg">
                <h4 className="text-green-400 font-bold mb-2 text-sm font-heading">Windows</h4>
                <pre className="text-xs text-gray-300 bg-black/70 border border-white/10 rounded p-3 overflow-x-auto">.\\setup-ui.ps1</pre>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Verify model availability before first chat: <code className="bg-black/50 px-1 rounded text-green-300">docker compose -p christopher exec -T ollama ollama list</code>
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Standard setup commands: <code className="bg-black/50 px-1 rounded text-green-300">bash ./setup.sh</code> on Linux/macOS or <code className="bg-black/50 px-1 rounded text-green-300">.\\setup.ps1</code> on Windows.
            </p>
          </section>
          
          {/* 1. Preamble */}
          <section>
            <h2 className="text-xl font-bold text-green-400 mb-3 font-heading">1. PREAMBLE</h2>
            <p className="mb-3">
              These Terms and Conditions ("Terms") govern your use of the <strong>Christopher AI</strong> software ("the Software"), a self-hosted, local-area-network (LAN) artificial intelligence chatbot powered by Ollama and Next.js. By downloading, installing, or using the Software, you agree to be bound by these Terms.
            </p>
            <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 text-yellow-200 text-xs md:text-sm italic">
              ⚠️ IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THE SOFTWARE.
            </div>
          </section>

          {/* 2. License */}
          <section>
            <h2 className="text-xl font-bold text-green-400 mb-3 font-heading">2. LICENSE GRANT (OPEN SOURCE)</h2>
            <p className="mb-3">
              <a href="https://www.gnu.org/licenses/agpl-3.0" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                <Image
                  src="https://img.shields.io/badge/License-AGPL_v3-blue.svg"
                  alt="License: AGPL v3"
                  width={90}
                  height={20}
                  className="rounded"
                />
              </a>
            </p>
            <p className="mb-3">
              Subject to your compliance with these Terms, the Project Creator grants you a perpetual, worldwide, non-exclusive, royalty-free, irrevocable license under the Project Creator's copyright to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 text-gray-400">
              <li><strong className="text-white">Use:</strong> Run the Software for personal, educational, or commercial purposes.</li>
              <li><strong className="text-white">Modify:</strong> Alter the source code to suit your needs.</li>
              <li><strong className="text-white">Distribute:</strong> Copy and distribute the Software or modified versions.</li>
              <li><strong className="text-white">Sublicense:</strong> Grant sublicenses to others.</li>
            </ul>
            <p className="mb-3">
              <strong className="text-white">Base License:</strong> This Software is licensed under the <strong className="text-green-300">GNU Affero General Public License v3.0 (AGPL v3)</strong>. This license ensures that any modifications or derivative works must also be released under the same license.
            </p>
            <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" className="inline-block text-green-400 hover:text-green-300 underline text-xs">
              View the full AGPL v3 license text →
            </a>
          </section>

          {/* 3. Definitions */}
          <section>
            <h2 className="text-xl font-bold text-green-400 mb-3 font-heading">3. DEFINITIONS</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-white">"Host Device":</strong> The physical machine (server, laptop, desktop) where the Docker container is running.</li>
              <li><strong className="text-white">"User":</strong> Any individual accessing the Christopher AI interface via a web browser on the local network.</li>
              <li><strong className="text-white">"AI Output":</strong> Any text, code, image, or data generated by the underlying Large Language Model (LLM).</li>
              <li><strong className="text-white">"Local Storage":</strong> Data stored in the browser's <code className="bg-black/50 px-1 rounded text-green-300">localStorage</code> or Docker volumes on the Host Device.</li>
            </ul>
          </section>

          {/* 4. Local Deployment */}
          <section>
            <h2 className="text-xl font-bold text-green-400 mb-3 font-heading">4. NATURE OF THE SERVICE</h2>
            <div className="bg-black/60 border border-green-500/30 p-4 rounded-lg mb-4">
              <h4 className="text-green-400 font-bold mb-2 text-sm font-heading">4.1 Self-Hosting Responsibility</h4>
              <p className="text-gray-400 text-sm">
                The Software is designed to run <strong className="text-white">locally</strong> on your infrastructure. You are solely responsible for providing the hardware, maintaining security, managing Docker updates, and ensuring network connectivity.
              </p>
            </div>
            <div className="bg-black/60 border border-green-500/30 p-4 rounded-lg">
              <h4 className="text-green-400 font-bold mb-2 text-sm font-heading">4.2 No Ongoing Runtime Cloud Dependency</h4>
              <p className="text-gray-400 text-sm">
                Christopher AI does not call home or require continuous cloud services during normal runtime. All processing occurs on your Host Device. Setup-time downloads (for example model weights or package dependencies) may still occur from third-party repositories during installation or updates.
              </p>
            </div>
          </section>

          {/* 5. Data Privacy */}
          <section>
            <h2 className="text-xl font-bold text-green-400 mb-3 font-heading">5. DATA PRIVACY & IMPERMANENCE</h2>
            <div className="bg-yellow-900/20 border border-yellow-500/50 p-4 rounded-lg text-yellow-200 text-sm mb-4">
              <strong className="block mb-1 font-heading">⚠️ CRITICAL WARNING: LOCAL, USER-MANAGED STORAGE</strong>
              Chat history is stored in the browser's <strong className="text-white">localStorage</strong> and encrypted at rest for password-protected profiles. If you clear browser storage, switch browsers, use Incognito mode, or lose the device/password, <strong className="text-white">chat history may be permanently inaccessible</strong>. The Software does not provide a centralized recovery service.
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-white">Password Requirement:</strong> Profiles require a password before chat access. Password strength and secrecy are your responsibility.</li>
              <li><strong className="text-white">No Data Collection:</strong> The Project Creator does not collect, track, or store any user data. The Software contains no telemetry.</li>
              <li><strong className="text-white">Secure-by-Default Transport:</strong> Use HTTPS on <code className="bg-black/50 px-1 rounded text-green-300">:3001</code> as the standard LAN access path for encrypted transit.</li>
              <li><strong className="text-white">Fallback-Only Compatibility Path:</strong> HTTP on <code className="bg-black/50 px-1 rounded text-green-300">:3002</code> is fallback only for compatibility/troubleshooting and is not encrypted in transit.</li>
              <li><strong className="text-white">Transport Indicator:</strong> The app header displays whether the active session is HTTPS or HTTP.</li>
              <li><strong className="text-white">Certificate Trust:</strong> First-time client devices may show a warning until they trust the generated self-signed certificate.</li>
              <li><strong className="text-white">Network Security:</strong> You are responsible for securing your local network against unauthorized access.</li>
            </ul>
          </section>

          {/* 6. AI Disclaimer */}
          <section>
            <h2 className="text-xl font-bold text-green-400 mb-3 font-heading">6. AI OUTPUT DISCLAIMER</h2>
            <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg text-red-200 text-sm mb-4">
              <h4 className="font-bold mb-1 font-heading">6.1 No Professional Advice</h4>
              <p>
                The AI models are probabilistic engines. They are <strong className="text-white">NOT</strong> experts in law, medicine, or finance. Do not rely on AI Output for critical decisions.
              </p>
            </div>
            <div className="bg-amber-900/20 border border-amber-500/50 p-4 rounded-lg text-amber-200 text-sm mb-4">
              <h4 className="font-bold mb-1 font-heading">6.2 Model Recency and Knowledge Limits</h4>
              <p>
                The default model (<code className="bg-black/50 px-1 rounded text-amber-100">llama3.2:1b</code>) has a published cutting knowledge date of <strong className="text-white">December 2023</strong>. Date-sensitive answers can be outdated. Always verify current events, legal rules, security advisories, and other time-critical information using up-to-date authoritative sources.
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-white">Hallucinations:</strong> AI models may generate factually incorrect information. Verify all critical data independently.</li>
              <li><strong className="text-white">Content Moderation:</strong> You are responsible for configuring model parameters to align with your ethical standards.</li>
            </ul>
          </section>

          {/* 7. Liability */}
          <section>
            <h2 className="text-xl font-bold text-green-400 mb-3 font-heading">7. LIMITATION OF LIABILITY</h2>
            <div className="bg-gray-900/80 border border-gray-700 p-4 rounded-lg text-gray-400 text-sm italic">
              <p className="mb-2">
                <strong className="text-white">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
              </p>
              <p>
                THE PROJECT CREATOR SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF DATA, ERRORS IN AI OUTPUT, OR SECURITY BREACHES. THE SOFTWARE IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND.
              </p>
            </div>
          </section>

          {/* 8. Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-green-400 mb-3 font-heading">8. GOVERNING LAW</h2>
            <p className="text-gray-400">
              These Terms shall be governed by and construed in accordance with the laws of <strong className="text-white">Great Britain</strong>.
            </p>
          </section>

        </div>

        {/* Footer / Back Button */}
        <div className="mt-12 pt-8 border-t border-green-500/20 flex flex-col items-center">
          <p className="text-gray-500 text-xs mb-6 font-mono">Built with ❤️ in the UK 🇬🇧 for privacy enthusiasts and self-hosters.</p>
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/20 transition-all font-heading text-sm tracking-wider"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO CHRISTOPHER
          </button>
        </div>

      </div>
    </div>
  );
}
