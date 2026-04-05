"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Identity required: Enter a username");
      return;
    }
    
    // Local profile policy: password is required and must meet minimum length.
    if (password.length < 8) {
      setError("Passphrase too short (min 8 chars)");
      return;
    }

    // Set cookies for session AND username
    document.cookie = `christopher_user=${username.toLowerCase()}; path=/; max-age=86400`;
    document.cookie = `christopher_auth=authorized; path=/; max-age=86400`;
    
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-950 text-[#00ff88] font-heading">
      <form onSubmit={handleLogin} className="p-8 border border-[#00ff88] bg-black/50 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(0,255,136,0.2)] text-center w-full max-w-md">
        <h1 className="text-3xl mb-2 tracking-widest">IDENTIFY</h1>
        <p className="text-xs text-gray-400 mb-6 font-sans">Multi-user neural link initialization</p>
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-black/80 border border-[#00ff88]/50 p-3 mb-4 text-center text-white focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,136,0.4)] font-sans"
          placeholder="CALLSIGN (USERNAME)"
          autoComplete="off"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black/80 border border-[#00ff88]/50 p-3 mb-4 text-center text-white focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,136,0.4)] font-sans"
          placeholder="PASSPHRASE"
        />
        {error && <p className="text-red-500 text-sm mb-4 font-sans">{error}</p>}
        
        <button className="w-full bg-[#00ff88] text-black font-bold py-3 hover:bg-[#00cc6a] transition-colors tracking-widest">
          CONNECT
        </button>
        <p className="mt-4 text-xs text-gray-500 font-sans">
          Note: History is stored locally and encrypted at rest for password-protected profiles. Use the HTTPS LAN URL for encrypted transport in transit.
        </p>
      </form>
    </div>
  );
}
