import React, { useState, useEffect } from 'react';
import { getRegisteredUsers, registerUser } from '../data/users';
import { loginUserInDb, registerUserInDb, recordLoginInDb } from '../services/api';

export default function AuthGate({
  isOpen = true,
  onClose,
  onLogin,
  promptMessage = '',
  initialMode = 'user-login'
}) {
  const [authMode, setAuthMode] = useState(initialMode); // 'user-login', 'user-signup', 'admin-login'
  
  // Form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanInput = email.trim().toLowerCase();

    if (authMode === 'user-login') {
      if (!cleanInput || !password.trim()) {
        setError('Please enter your email/phone and password.');
        return;
      }

      setLoading(true);
      try {
        // 1. Authenticate with PostgreSQL Backend
        const dbRes = await loginUserInDb(cleanInput, password);
        if (dbRes && dbRes.id) {
          onLogin(dbRes, rememberMe);
          if (onClose) onClose();
          setLoading(false);
          return;
        }

        // 2. Local registered fallback
        const registeredUsers = getRegisteredUsers();
        const existingUser = registeredUsers.find(
          (u) =>
            u.email.toLowerCase() === cleanInput ||
            (u.phone && u.phone.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, ''))
        );

        if (!existingUser) {
          setError('No registered account found with this email/number. Please click "New User" to register first.');
          setLoading(false);
          return;
        }

        if (existingUser.password !== password) {
          setError('Incorrect password. Please try again.');
          setLoading(false);
          return;
        }

        await recordLoginInDb(existingUser);
        onLogin(existingUser, rememberMe);
        if (onClose) onClose();
      } catch (err) {
        setError(err.message || 'Login failed.');
      } finally {
        setLoading(false);
      }
    } else if (authMode === 'user-signup') {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all required fields.');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters long.');
        return;
      }

      setLoading(true);
      try {
        const payload = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || '+91 98765 43210',
          password: password,
          role: 'user',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`
        };

        // Save directly to PostgreSQL Database
        const dbUser = await registerUserInDb(payload);
        if (dbUser && dbUser.id) {
          try {
            registerUser(payload);
          } catch (e) {}
          onLogin(dbUser, rememberMe);
          if (onClose) onClose();
          setLoading(false);
          return;
        }

        const newUser = registerUser(payload);
        await recordLoginInDb(newUser);
        onLogin(newUser, rememberMe);
        if (onClose) onClose();
      } catch (err) {
        setError(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    } else if (authMode === 'admin-login') {
      const normalizedKey = adminKey.trim();
      if (!email.trim() || !adminKey.trim()) {
        setError('Please provide Admin ID and Security Passkey.');
        return;
      }
      if (normalizedKey === 'gagan987') {
        const adminUser = {
          id: 'usr_gagan_admin',
          name: 'Gagan (Store Admin)',
          email: 'admin@gaganmobile.com',
          phone: '+91 98726-22624',
          role: 'admin',
          avatar: '/gmc_logo.jpg'
        };
        await recordLoginInDb(adminUser);
        onLogin(adminUser, rememberMe);
        if (onClose) onClose();
      } else {
        setError('Invalid Admin Passkey. Access restricted.');
      }
    }
  };

  const handleQuickCustomer = async () => {
    const user = {
      id: 'usr_krish_jindal',
      name: 'Krish Jindal',
      email: 'krish@gmail.com',
      phone: '+91 98765 43210',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'
    };
    await recordLoginInDb(user);
    onLogin(user, true);
    if (onClose) onClose();
  };

  const handleQuickAdmin = async () => {
    const admin = {
      id: 'usr_gagan_admin',
      name: 'Gagan (Store Admin)',
      email: 'admin@gaganmobile.com',
      phone: '+91 98726-22624',
      role: 'admin',
      avatar: '/gmc_logo.jpg'
    };
    await recordLoginInDb(admin);
    onLogin(admin, true);
    if (onClose) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Card Container */}
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0d131f]/95 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-white my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button if onClose provided */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-2.5 flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl p-0.5 bg-gradient-to-tr from-cyan-400 via-amber-300 to-cyan-500 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
              <div className="h-full w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <img
                  src="/gmc_logo.jpg"
                  alt="Gagan Mobile Care"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <span className="absolute -bottom-1.5 right-[-6px] rounded-full bg-cyan-400 px-2 py-0.2 text-[9px] font-black uppercase text-black shadow-md tracking-wider">
              Verified
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
            GAGAN <span className="bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">MOBILE CARE</span>
          </h2>
          <p className="mt-0.5 text-xs text-gray-400">
            Maur Mandi, Punjab • Official Mobile & Gadgets Hub
          </p>
        </div>

        {/* Prompt Alert if opened via ordering action */}
        {promptMessage && (
          <div className="mb-4 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-2.5 text-xs font-semibold text-cyan-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-cyan-400">shopping_bag</span>
            <span>{promptMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-black/50 p-1 mb-5 border border-white/5">
          <button
            type="button"
            onClick={() => { setAuthMode('user-login'); setError(''); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              authMode === 'user-login'
                ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('user-signup'); setError(''); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              authMode === 'user-signup'
                ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            New User
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('admin-login'); setError(''); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              authMode === 'admin-login'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.35)]'
                : 'text-gray-400 hover:text-amber-300'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">shield</span>
            Admin
          </button>
        </div>

        {/* Form Error Banner */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* USER SIGNUP: Full Name */}
          {authMode === 'user-signup' && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Krish Jindal"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>
          )}

          {/* USER LOGIN & SIGNUP: Email/Username */}
          {authMode !== 'admin-login' ? (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                  mail
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@gmail.com or 9876543210"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>
          ) : (
            /* ADMIN LOGIN: Admin Email */
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-1 flex items-center justify-between">
                <span>Admin Identifier</span>
                <span className="text-[10px] text-gray-400 lowercase">e.g. admin@gaganmobile.com</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-amber-400 text-[18px]">
                  manage_accounts
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gaganmobile.com"
                  className="w-full rounded-xl border border-amber-500/30 bg-white/5 pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>
          )}

          {/* Phone Number (Optional on signup) */}
          {authMode === 'user-signup' && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Phone Number (For Order Delivery & Updates)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                  call
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>
          )}

          {/* Password (User) */}
          {authMode !== 'admin-login' ? (
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>
          ) : (
            /* Admin Passkey */
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-1 flex items-center justify-between">
                <span>Security Passkey</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-amber-400 text-[18px]">
                  key
                </span>
                <input
                  type="password"
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-amber-500/30 bg-white/5 pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>
          )}

          {/* Remember session checkbox */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-700 bg-white/10 text-cyan-400 focus:ring-0"
              />
              Stay logged in
            </label>
            {authMode === 'user-login' && (
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered contact.')}
                className="text-xs text-cyan-400 hover:underline"
              >
                Forgot?
              </button>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 sm:py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-60 ${
              authMode === 'admin-login'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {authMode === 'admin-login' ? 'security' : 'login'}
            </span>
            {loading ? 'Please wait...' : (
              <>
                {authMode === 'user-login' && 'Sign In & Continue'}
                {authMode === 'user-signup' && 'Create Account & Order'}
                {authMode === 'admin-login' && 'Open Admin Control Center'}
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Customer / Admin Access */}
        <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={handleQuickCustomer}
            className="flex-1 py-1.5 px-2 rounded-lg border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold transition-all text-center truncate"
          >
            ⚡ Quick Test Customer
          </button>
          <button
            type="button"
            onClick={handleQuickAdmin}
            className="flex-1 py-1.5 px-2 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold transition-all text-center truncate"
          >
            🛡️ Store Admin Login
          </button>
        </div>

        {/* Help contact */}
        <div className="mt-4 text-center text-[11px] text-gray-500">
          Need in-person assistance? Call Gagan Mobile Care:{' '}
          <a href="tel:9872622624" className="text-cyan-400 font-semibold hover:underline">
            98726-22624
          </a>
        </div>
      </div>
    </div>
  );
}
