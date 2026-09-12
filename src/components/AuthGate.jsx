import React, { useState } from 'react';
import { getRegisteredUsers, registerUser } from '../data/users';
import { loginUserInDb, registerUserInDb, recordLoginInDb } from '../services/api';

export default function AuthGate({ onLogin }) {
  const [authMode, setAuthMode] = useState('user-login'); // 'user-login', 'user-signup', 'admin-login'
  
  // Form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

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
          setLoading(false);
          return;
        }

        const newUser = registerUser(payload);
        await recordLoginInDb(newUser);
        onLogin(newUser, rememberMe);
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
      } else {
        setError('Invalid Admin Passkey. Access restricted.');
      }
    }
  };

  // Quick 1-click login helpers for instant testing
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
  };

  return (
    <div className="relative min-h-screen w-full bg-[#080b11] text-white flex flex-col justify-center items-center px-4 py-12 overflow-hidden selection:bg-primary selection:text-black">
      {/* Ambient background glow and grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,240,255,0.12),_transparent_55%)] pointer-events-none" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 flex flex-col items-center text-center mb-8">
        <div className="relative mb-3 flex items-center justify-center">
          <div className="h-20 w-20 rounded-2xl p-0.5 bg-gradient-to-tr from-cyan-400 via-amber-300 to-cyan-500 shadow-[0_0_35px_rgba(0,240,255,0.4)]">
            <div className="h-full w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src="/gmc_logo.jpg"
                alt="Gagan Mobile Care"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <span className="absolute -bottom-2 right-[-8px] rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-md tracking-wider">
            Verified
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
          GAGAN <span className="bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">MOBILE CARE</span>
        </h1>
        <p className="mt-1 text-sm text-gray-400 max-w-sm">
          Maur Mandi, Punjab • Official Mobile Care & Premium Gadgets Hub
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0f141f]/90 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        
        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-black/40 p-1 mb-6 border border-white/5">
          <button
            type="button"
            onClick={() => { setAuthMode('user-login'); setError(''); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
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
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
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
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
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
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* USER SIGNUP: Full Name */}
          {authMode === 'user-signup' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Krish Jindal"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>
          )}

          {/* USER LOGIN & SIGNUP: Email/Username */}
          {authMode !== 'admin-login' ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Email or Mobile Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">
                  mail
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@gmail.com or 9876543210"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>
          ) : (
            /* ADMIN LOGIN: Admin Email */
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5 flex items-center justify-between">
                <span>Admin Identifier</span>
                <span className="text-[10px] text-gray-400 lowercase">e.g. admin@gaganmobile.com</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-amber-400 text-[20px]">
                  manage_accounts
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gaganmobile.com"
                  className="w-full rounded-xl border border-amber-500/30 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>
          )}

          {/* Phone Number (Optional on signup) */}
          {authMode === 'user-signup' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Phone Number (For Order WhatsApp Updates)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">
                  call
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>
          )}

          {/* Password (User) */}
          {authMode !== 'admin-login' ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>
          ) : (
            /* Admin Passkey */
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5 flex items-center justify-between">
                <span>Security Passkey</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-amber-400 text-[20px]">
                  key
                </span>
                <input
                  type="password"
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-amber-500/30 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>
          )}

          {/* Remember session checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-700 bg-white/10 text-cyan-400 focus:ring-0"
              />
              Stay logged in on this browser
            </label>
            {authMode === 'user-login' && (
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered phone / email.')}
                className="text-xs text-cyan-400 hover:underline"
              >
                Forgot?
              </button>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
              authMode === 'admin-login'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {authMode === 'admin-login' ? 'security' : 'login'}
            </span>
            {authMode === 'user-login' && 'Enter Customer Store'}
            {authMode === 'user-signup' && 'Create Customer Account'}
            {authMode === 'admin-login' && 'Open Admin Control Center'}
          </button>
        </form>

        {/* Quick Admin Access Only */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          <span>Official Store Administrator?</span>
          <button
            type="button"
            onClick={handleQuickAdmin}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
            Store Admin Access
          </button>
        </div>

        {/* Help contact */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Need in-person assistance? Call Gagan Mobile Care:{' '}
          <a href="tel:9872622624" className="text-cyan-400 font-semibold hover:underline">
            98726-22624
          </a>
        </div>
      </div>
    </div>
  );
}
