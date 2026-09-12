// Initial Seed: Only Store Admin Account
export const INITIAL_REGISTERED_USERS = [
  {
    id: 'usr_gagan_admin',
    name: 'Gagan (Store Admin)',
    email: 'admin@gaganmobile.com',
    phone: '+91 98726-22624',
    password: 'gagan987',
    role: 'admin',
    avatar: '/gmc_logo.jpg',
    isEmailVerified: true,
    provider: 'email',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

const STORAGE_KEY = 'gmc_registered_users_v2';

export const getRegisteredUsers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_USERS));
      return INITIAL_REGISTERED_USERS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_REGISTERED_USERS;
  }
};

export const saveRegisteredUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users in localStorage', e);
  }
};

export const findUserByEmail = (email) => {
  if (!email) return null;
  const users = getRegisteredUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
};

export const registerUser = ({ name, email, phone, password, role = 'user', avatar, provider = 'email' }) => {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  
  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email is already registered.');
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone ? phone.trim() : '+91 98765 00000',
    password: password || 'oauth_google_verified',
    role: role,
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    isEmailVerified: true,
    provider: provider,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveRegisteredUsers(users);
  return newUser;
};

export const resetUserPassword = (email, newPassword) => {
  const users = getRegisteredUsers();
  const normalized = email.trim().toLowerCase();
  const userIdx = users.findIndex((u) => u.email.toLowerCase() === normalized);
  
  if (userIdx === -1) {
    throw new Error('User not found.');
  }

  users[userIdx].password = newPassword;
  saveRegisteredUsers(users);
  return users[userIdx];
};

export const updateUserProfile = (updatedUser) => {
  const users = getRegisteredUsers();
  const normalized = updatedUser.email.trim().toLowerCase();
  const userIdx = users.findIndex((u) => u.email.toLowerCase() === normalized);
  
  if (userIdx !== -1) {
    users[userIdx] = { ...users[userIdx], ...updatedUser };
  } else {
    users.push(updatedUser);
  }
  saveRegisteredUsers(users);
  return updatedUser;
};

export const validateEmailFormat = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).trim().toLowerCase());
};

