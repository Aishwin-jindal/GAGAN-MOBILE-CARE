import React, { useState } from 'react';
import { getRegisteredUsers, registerUser } from '../data/users';
import { loginUserInDb, registerUserInDb, recordLoginInDb } from '../services/api';

export default function AuthGate({
  isOpen = true,
  onClose,
  onLogin,
  promptMessage = ''
}) {
  // Single Universal Login Form State
  const [identifier, setIdentifier] = useState(''); // Email or Mobile Number
  const [name, setName] = useState(''); // Optional name for first-time profile
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanInput = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanInput || !cleanPassword) {
      setError('Please enter your Mobile Number or Email, and Password.');
      return;
    }

    setLoading(true);
    try {
      // 1. Check if this is the Store Admin
      const cleanPhoneDigits = cleanInput.replace(/[^0-9]/g, '');
      const isAdminEmail = cleanInput === 'admin@gaganmobile.com' || cleanInput === 'admin';
      const isAdminPhone = cleanPhoneDigits === '9872622624';
      const isAdminPasskey = cleanPassword === 'gagan987';

      if ((isAdminEmail || isAdminPhone) && isAdminPasskey) {
        const adminUser = {
          id: 'usr_gagan_admin',
          name: 'Gagan (Store Admin)',
          email: 'admin@gaganmobile.com',
          phone: '+91 98726-22624',
          role: 'admin',
          avatar: '/gmc_logo.jpg',
          isEmailVerified: true
        };
        await recordLoginInDb(adminUser);
        onLogin(adminUser, rememberMe);
        if (onClose) onClose();
        setLoading(false);
        return;
      }

      // 2. Try PostgreSQL Backend Login
      const dbRes = await loginUserInDb(cleanInput, cleanPassword);
      if (dbRes && dbRes.id) {
        onLogin(dbRes, rememberMe);
        if (onClose) onClose();
        setLoading(false);
        return;
      }

      // 3. Check Local Registered Users
      const registeredUsers = getRegisteredUsers();
      const existingUser = registeredUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanInput ||
          (u.phone && u.phone.replace(/[^0-9]/g, '') === cleanPhoneDigits)
      );

      if (existingUser) {
        // Check password for existing account
        if (existingUser.password !== cleanPassword) {
          setError('Incorrect password for this registered account. Please try again.');
          setLoading(false);
          return;
        }
        await recordLoginInDb(existingUser);
        onLogin(existingUser, rememberMe);
        if (onClose) onClose();
        setLoading(false);
        return;
      }

      // 4. New Customer -> Automatically Create Account & Log In in 1-Click
      const isEmail = cleanInput.includes('@');
      const defaultName = name.trim() || (isEmail ? cleanInput.split('@')[0] : 'GMC Customer');
      const payload = {
        name: defaultName,
        email: isEmail ? cleanInput : `${cleanPhoneDigits || Date.now()}@gmc.local`,
        phone: isEmail ? '+91 98765 43210' : cleanInput,
        password: cleanPassword,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(defaultName)}`
      };

      // Save into PostgreSQL
      const dbNewUser = await registerUserInDb(payload);
      if (dbNewUser && dbNewUser.id) {
        try {
          registerUser(payload);
        } catch (e) {}
        onLogin(dbNewUser, rememberMe);
        if (onClose) onClose();
        setLoading(false);
        return;
      }

      // Local fallback register
      const localNewUser = registerUser(payload);
      await recordLoginInDb(localNewUser);
      onLogin(localNewUser, rememberMe);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Card Container */}
      <div
        className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-white/15 bg-[#0d131f]/95 p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-white my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="Close"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
          </button>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative mb-2.5 flex items-center justify-center">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl p-0.5 bg-gradient-to-tr from-cyan-400 via-amber-300 to-cyan-500 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
              <div className="h-full w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <img
                  src="/gmc_logo.jpg"
                  alt="Gagan Mobile Care"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <span className="absolute -bottom-1.5 right-[-6px] rounded-full bg-cyan-400 px-2 py-0.2 text-[8px] sm:text-[9px] font-black uppercase text-black shadow-md tracking-wider">
              Verified
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
            GAGAN <span className="bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">MOBILE CARE</span>
          </h2>
          <p className="mt-0.5 text-[11px] sm:text-xs text-gray-400">
            Maur Mandi, Punjab • Official Mobile & Gadgets Hub
          </p>
        </div>

        {/* Prompt Alert if opened via ordering action */}
        {promptMessage && (
          <div className="mb-4 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-[17px] text-cyan-400">shopping_bag</span>
            <span className="leading-tight">{promptMessage}</span>
          </div>
        )}

        {/* Form Error Banner */}
        {error && (
          <div className="mb-3.5 rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm shrink-0">error</span>
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* Single Universal Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Optional Name */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1 flex items-center justify-between">
              <span>Full Name</span>
              <span className="text-[10px] text-gray-500 lowercase">Optional for new accounts</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                badge
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Krish Jindal"
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          {/* Email or Mobile Number */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Mobile Number or Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                contact_phone
              </span>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter mobile number or email"
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                lock
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          {/* Remember session checkbox */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-700 bg-white/10 text-cyan-400 focus:ring-0"
              />
              Stay logged in on this device
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-60 mt-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]"
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[18px]">
              login
            </span>
            {loading ? 'Please wait...' : 'Sign In & Continue'}
          </button>
        </form>

        {/* Store Helpline Footer */}
        <div className="mt-4 pt-3 border-t border-white/5 text-center text-[11px] text-gray-500">
          Gagan Mobile Care Helpline:{' '}
          <a href="tel:9872622624" className="text-cyan-400 font-semibold hover:underline">
            98726-22624
          </a>
        </div>
      </div>
    </div>
  );
}
