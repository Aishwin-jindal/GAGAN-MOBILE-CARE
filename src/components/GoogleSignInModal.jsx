import React, { useState } from 'react';
import { findUserByEmail, registerUser } from '../data/users';

const GOOGLE_ACCOUNTS = [
  {
    name: 'Krish Jindal',
    email: 'krish@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    phone: '+91 98765 43210'
  },
  {
    name: 'Gagan Store Owner',
    email: 'gagan@gmail.com',
    avatar: '/gmc_logo.jpg',
    phone: '+91 98726-22624'
  }
];

export default function GoogleSignInModal({ isOpen, onClose, onGoogleSuccess }) {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleSelectAccount = (account) => {
    setIsAuthenticating(true);
    setAuthError('');

    setTimeout(() => {
      let user = findUserByEmail(account.email);
      if (!user) {
        // Automatically create verified profile via Google Auth
        user = registerUser({
          name: account.name,
          email: account.email,
          phone: account.phone || '+91 98765 00000',
          avatar: account.avatar,
          provider: 'google',
          role: account.email.includes('admin') || account.email.includes('gagan') ? 'admin' : 'user'
        });
      }
      setIsAuthenticating(false);
      onGoogleSuccess(user);
    }, 900);
  };

  const handleCustomGoogleLogin = (e) => {
    e.preventDefault();
    if (!customEmail.includes('@') || !customEmail.includes('.')) {
      setAuthError('Please enter a valid Google / Gmail address.');
      return;
    }
    const finalName = customName.trim() || customEmail.split('@')[0].replace(/[._]/g, ' ');
    const account = {
      name: finalName,
      email: customEmail.trim().toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalName)}`,
      phone: '+91 98765 00000'
    };
    handleSelectAccount(account);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-[420px] rounded-3xl bg-white text-gray-800 shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Header with Google Logo */}
        <div className="pt-8 pb-4 px-7 text-center relative border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex justify-center mb-3">
            <svg className="w-10 h-10" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 font-sans">Sign in with Google</h2>
          <p className="text-xs text-gray-500 mt-1">
            to continue to <span className="font-semibold text-gray-700">Gagan Mobile Care</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isAuthenticating ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="relative mb-4">
                <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-600 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-gray-800">Verifying Google Account...</p>
              <p className="text-xs text-gray-400 mt-1">Establishing secure OAuth session</p>
            </div>
          ) : (
            <>
              {authError && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {authError}
                </div>
              )}

              {/* Choose from known Google accounts */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 px-1">
                  Choose an active Google Account
                </p>
                {GOOGLE_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all text-left group"
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {acc.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{acc.email}</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-300 group-hover:text-blue-500 text-[18px]">
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>

              {/* Use another Google account toggle */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {!showCustomInput ? (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-50 border border-dashed border-gray-200 transition-all text-left text-gray-700 hover:text-blue-600"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <span className="material-symbols-outlined text-[20px]">person_add</span>
                    </div>
                    <span className="text-sm font-semibold">Use another Google account</span>
                  </button>
                ) : (
                  <form onSubmit={handleCustomGoogleLogin} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Google / Gmail Address
                      </label>
                      <input
                        type="email"
                        required
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowCustomInput(false)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                      >
                        Sign In with Google
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}

          {/* Privacy footer */}
          <p className="text-[11px] text-gray-400 text-center mt-6">
            To continue, Google will share your name, email address, and profile picture with Gagan Mobile Care.
          </p>
        </div>
      </div>
    </div>
  );
}
