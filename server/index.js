import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { pool, isDbConnected, testConnection } from './db/pool.js';
import { initDatabase } from './db/initDb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.BACKEND_PORT || 5050;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// ----------------------------------------------------
// 0. ROOT BACKEND DASHBOARD & SYSTEM STATUS (GET /)
// ----------------------------------------------------
app.get('/', async (req, res) => {
  const dbStatus = isDbConnected();
  let counts = { products: 0, orders: 0, users: 0, stories: 0, sessions: 0 };
  let usersList = [];
  let loginsList = [];
  let ordersList = [];
  let dbTime = new Date().toLocaleString();

  if (dbStatus) {
    try {
      const [pRes, oRes, uRes, sRes, sessRes, fullUsersRes, fullOrdersRes, fullSessRes] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM products'),
        pool.query('SELECT COUNT(*) FROM orders'),
        pool.query('SELECT COUNT(*) FROM users'),
        pool.query('SELECT COUNT(*) FROM customer_stories'),
        pool.query('SELECT COUNT(*) FROM login_sessions'),
        pool.query('SELECT id, name, email, phone, role, avatar, address, is_email_verified, provider, created_at, last_login_at FROM users ORDER BY created_at DESC'),
        pool.query('SELECT id, customer_name, customer_email, customer_phone, total_amount, payment_method, status, created_at FROM orders ORDER BY created_at DESC LIMIT 8'),
        pool.query('SELECT id, user_id, user_name, user_email, role, ip_address, device_info, status, login_time FROM login_sessions ORDER BY login_time DESC LIMIT 12')
      ]);
      counts = {
        products: parseInt(pRes.rows[0].count),
        orders: parseInt(oRes.rows[0].count),
        users: parseInt(uRes.rows[0].count),
        stories: parseInt(sRes.rows[0].count),
        sessions: parseInt(sessRes.rows[0].count)
      };
      usersList = fullUsersRes.rows;
      ordersList = fullOrdersRes.rows;
      loginsList = fullSessRes.rows;
    } catch (e) {
      console.warn('Dashboard query error:', e.message);
    }
  }

  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gagan Mobile Care | Backend Engine & User Directory</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #06090e;
          color: #f1f5f9;
          min-height: 100vh;
          padding: 36px 20px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .container {
          max-width: 1100px;
          width: 100%;
        }
        .header {
          background: linear-gradient(135deg, rgba(13, 19, 31, 0.95), rgba(20, 27, 45, 0.85));
          border: 1px solid rgba(0, 240, 255, 0.25);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .header::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(0, 240, 255, 0.18), transparent 70%);
          pointer-events: none;
        }
        .badge-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: ${dbStatus ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'};
          color: ${dbStatus ? '#10b981' : '#f59e0b'};
          border: 1px solid ${dbStatus ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'};
        }
        .pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${dbStatus ? '#10b981' : '#f59e0b'};
          box-shadow: 0 0 12px ${dbStatus ? '#10b981' : '#f59e0b'};
        }
        h1 {
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          color: #94a3b8;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .btn-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .btn-primary {
          background: linear-gradient(135deg, #00f0ff 0%, #0070f3 100%);
          color: #000;
          box-shadow: 0 4px 16px rgba(0, 240, 255, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 240, 255, 0.45);
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #f1f5f9;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(0, 240, 255, 0.4);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: rgba(13, 19, 31, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(10px);
          transition: border-color 0.2s;
        }
        .stat-card:hover {
          border-color: rgba(0, 240, 255, 0.3);
        }
        .stat-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .stat-val {
          font-size: 30px;
          font-weight: 900;
          color: #00f0ff;
          font-family: 'JetBrains Mono', monospace;
        }
        .stat-sub {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 4px;
        }
        .section-card {
          background: rgba(13, 19, 31, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-badge {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 9999px;
          background: rgba(0, 240, 255, 0.15);
          color: #00f0ff;
          font-weight: 700;
        }
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        th {
          text-align: left;
          padding: 12px 14px;
          color: #64748b;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.2);
        }
        td {
          padding: 14px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;
        }
        tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }
        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .avatar-img {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #000;
        }
        .user-name {
          font-weight: 700;
          color: #ffffff;
        }
        .user-id {
          font-size: 11px;
          color: #64748b;
          font-family: 'JetBrains Mono', monospace;
        }
        .role-pill {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .role-admin {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .role-user {
          background: rgba(0, 240, 255, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(0, 240, 255, 0.3);
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }
        .status-success {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }
        .status-active {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }
        .method {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
        }
        .get { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .post { background: rgba(0, 240, 255, 0.2); color: #00f0ff; }
        .put { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .delete { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .patch { background: rgba(168, 85, 247, 0.2); color: #c084fc; }
        .endpoint-link {
          color: #38bdf8;
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
        }
        .endpoint-link:hover {
          text-decoration: underline;
        }
        .mono-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #94a3b8;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #475569;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Main Top Bar -->
        <div class="header">
          <div class="badge-row">
            <div class="status-badge">
              <div class="pulse"></div>
              ${dbStatus ? 'PostgreSQL Active & Synced' : 'Database Offline / Fallback'}
            </div>
            <span style="font-size: 12px; color: #64748b;">Port ${PORT} • DB Server</span>
          </div>
          <h1>Gagan Mobile Care • Core Backend</h1>
          <p class="subtitle">Official User Identity Engine & Relational Database • Maur Mandi, Punjab (+91 98726-22624)</p>
          <div class="btn-group">
            <a href="http://localhost:3000" target="_blank" class="btn btn-primary">
              🚀 Open Storefront App (Vite)
            </a>
            <a href="/api/users" target="_blank" class="btn btn-secondary">
              👥 View Users API
            </a>
            <a href="/api/logins" target="_blank" class="btn btn-secondary">
              🔐 View Login Audit Log
            </a>
            <a href="/api/health" target="_blank" class="btn btn-secondary">
              ⚡ Test /api/health
            </a>
          </div>
        </div>

        <!-- KPI Metrics Grid -->
        <div class="grid">
          <div class="stat-card">
            <div class="stat-label">Registered Users</div>
            <div class="stat-val">${counts.users}</div>
            <div class="stat-sub">Accounts in PostgreSQL</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Login Sessions</div>
            <div class="stat-val">${counts.sessions}</div>
            <div class="stat-sub">Audit trail records</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Orders Logged</div>
            <div class="stat-val">${counts.orders}</div>
            <div class="stat-sub">Customer transactions</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Products in DB</div>
            <div class="stat-val">${counts.products}</div>
            <div class="stat-sub">Live inventory items</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Verified Stories</div>
            <div class="stat-val">${counts.stories}</div>
            <div class="stat-sub">Customer testimonials</div>
          </div>
        </div>

        <!-- 1. REGISTERED USERS & IDENTITIES -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-title">
              <span>👥</span> Registered User Accounts & Profiles
            </div>
            <span class="section-badge">${usersList.length} Active Accounts</span>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>User / Name</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Role</th>
                  <th>Delivery Address</th>
                  <th>Registered On</th>
                  <th>Last Active / Login</th>
                </tr>
              </thead>
              <tbody>
                ${
                  usersList.length === 0
                    ? '<tr><td colspan="7" style="text-align:center; color:#64748b; padding:24px;">No users registered in database yet.</td></tr>'
                    : usersList
                        .map(
                          (u) => `
                    <tr>
                      <td>
                        <div class="user-cell">
                          <img src="${u.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(u.name)}" alt="${u.name}" class="avatar-img" />
                          <div>
                            <div class="user-name">${u.name}</div>
                            <div class="user-id">${u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td><span style="color:#38bdf8; font-family:'JetBrains Mono', monospace; font-size:12px;">${u.email}</span></td>
                      <td><span style="color:#e2e8f0; font-size:12px;">${u.phone || '+91 98726-22624'}</span></td>
                      <td>
                        <span class="role-pill ${u.role === 'admin' ? 'role-admin' : 'role-user'}">
                          ${u.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                        </span>
                      </td>
                      <td><span style="color:#94a3b8; font-size:12px;">${u.address || 'Maur Mandi, Punjab'}</span></td>
                      <td><span class="mono-time">${u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}</span></td>
                      <td><span class="mono-time" style="color:#00f0ff;">${u.last_login_at ? new Date(u.last_login_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Active now'}</span></td>
                    </tr>
                  `
                        )
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. LOGIN AUDIT LOG & SESSIONS -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-title">
              <span>🔐</span> Real-Time Login Audit Log & Active Sessions
            </div>
            <span class="section-badge">${loginsList.length} Recent Logins</span>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>User Identity</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>IP Address</th>
                  <th>Device / Browser</th>
                  <th>Login Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                ${
                  loginsList.length === 0
                    ? '<tr><td colspan="7" style="text-align:center; color:#64748b; padding:24px;">No login sessions logged yet.</td></tr>'
                    : loginsList
                        .map(
                          (s) => `
                    <tr>
                      <td style="font-weight:700; color:#fff;">${s.user_name}</td>
                      <td><span style="color:#38bdf8; font-family:'JetBrains Mono', monospace; font-size:12px;">${s.user_email}</span></td>
                      <td>
                        <span class="role-pill ${s.role === 'admin' ? 'role-admin' : 'role-user'}">
                          ${s.role}
                        </span>
                      </td>
                      <td><span class="mono-time">${s.ip_address || '127.0.0.1'}</span></td>
                      <td><span style="color:#94a3b8; font-size:12px;">${s.device_info || 'Chrome on Desktop'}</span></td>
                      <td>
                        <span class="status-pill status-success">
                          ✓ ${s.status || 'Authenticated'}
                        </span>
                      </td>
                      <td><span class="mono-time" style="color:#00f0ff;">${s.login_time ? new Date(s.login_time).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now'}</span></td>
                    </tr>
                  `
                        )
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. RECENT ORDERS -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-title">
              <span>📦</span> Recent Logged Orders
            </div>
            <span class="section-badge">${ordersList.length} Logged Orders</span>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Email / Phone</th>
                  <th>Total Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${
                  ordersList.length === 0
                    ? '<tr><td colspan="7" style="text-align:center; color:#64748b; padding:24px;">No customer orders logged yet.</td></tr>'
                    : ordersList
                        .map(
                          (o) => `
                    <tr>
                      <td><span style="font-family:'JetBrains Mono', monospace; font-weight:700; color:#00f0ff;">${o.id}</span></td>
                      <td style="font-weight:700; color:#fff;">${o.customer_name}</td>
                      <td><span style="color:#94a3b8; font-size:12px;">${o.customer_email || ''} ${o.customer_phone ? '(' + o.customer_phone + ')' : ''}</span></td>
                      <td><span style="font-weight:800; color:#10b981; font-family:'JetBrains Mono', monospace;">₹${Number(o.total_amount || 0).toLocaleString('en-IN')}</span></td>
                      <td><span style="color:#cbd5e1; font-size:12px;">${o.payment_method || 'UPI / COD'}</span></td>
                      <td>
                        <span class="status-pill status-success">
                          ${o.status || 'Confirmed'}
                        </span>
                      </td>
                      <td><span class="mono-time">${o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}</span></td>
                    </tr>
                  `
                        )
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. REST API ENDPOINTS DIRECTORY -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-title">
              <span>⚡</span> Available REST API Endpoints
            </div>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="method get">GET</span></td>
                  <td><code>/api/users</code></td>
                  <td>All registered customer accounts & last login data</td>
                  <td><a href="/api/users" target="_blank" class="endpoint-link">Try &rarr;</a></td>
                </tr>
                <tr>
                  <td><span class="method get">GET</span></td>
                  <td><code>/api/logins</code></td>
                  <td>Audit log of all login sessions & client IPs</td>
                  <td><a href="/api/logins" target="_blank" class="endpoint-link">Try &rarr;</a></td>
                </tr>
                <tr>
                  <td><span class="method get">GET</span></td>
                  <td><code>/api/health</code></td>
                  <td>System diagnostics & live DB ping</td>
                  <td><a href="/api/health" target="_blank" class="endpoint-link">Try &rarr;</a></td>
                </tr>
                <tr>
                  <td><span class="method get">GET</span></td>
                  <td><code>/api/products</code></td>
                  <td>Full catalog (iPhones, Vivo, OnePlus, Samsung)</td>
                  <td><a href="/api/products" target="_blank" class="endpoint-link">Try &rarr;</a></td>
                </tr>
                <tr>
                  <td><span class="method get">GET</span></td>
                  <td><code>/api/orders</code></td>
                  <td>Order history with status & tracking</td>
                  <td><a href="/api/orders" target="_blank" class="endpoint-link">Try &rarr;</a></td>
                </tr>
                <tr>
                  <td><span class="method get">GET</span></td>
                  <td><code>/api/stories</code></td>
                  <td>Customer purchase reviews & photos</td>
                  <td><a href="/api/stories" target="_blank" class="endpoint-link">Try &rarr;</a></td>
                </tr>
                <tr>
                  <td><span class="method post">POST</span></td>
                  <td><code>/api/auth/record-login</code></td>
                  <td>Log a new user authentication session</td>
                  <td><span style="color:#64748b;">API Post</span></td>
                </tr>
                <tr>
                  <td><span class="method post">POST</span></td>
                  <td><code>/api/auth/login</code></td>
                  <td>Secure password authentication</td>
                  <td><span style="color:#64748b;">API Post</span></td>
                </tr>
                <tr>
                  <td><span class="method post">POST</span></td>
                  <td><code>/api/auth/register</code></td>
                  <td>New account registration with PostgreSQL write</td>
                  <td><span style="color:#64748b;">API Post</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="footer">
          Gagan Mobile Care Backend Engine • Powered by Express & PostgreSQL • Maur Mandi, Punjab
        </div>
      </div>
    </body>
    </html>
  `);
});

// ----------------------------------------------------
// HEALTH & DB STATUS ENDPOINT
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: isDbConnected() ? 'postgresql_connected' : 'local_storage_fallback',
    databaseName: 'gagan_mobile_care',
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// EMAIL OTP DISPATCHER ENDPOINT (POST /api/send-otp)
// ----------------------------------------------------
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, otp, purpose } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    console.log(`\n========================================`);
    console.log(`📩 [GAGAN MOBILE CARE] SENDING REAL OTP EMAIL`);
    console.log(`To: ${email}`);
    console.log(`Purpose: ${purpose || 'Authentication'}`);
    console.log(`Code: ${otp}`);
    console.log(`========================================\n`);

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465');
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    let transporter;

    if (smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const mailOptions = {
      from: `"Gagan Mobile Care" <${smtpUser || 'auth@gaganmobilecare.com'}>`,
      to: email,
      subject: `Gagan Mobile Care - Your Verification Code is [${otp}]`,
      text: `Your Gagan Mobile Care verification code is: ${otp}. Valid for 5 minutes.`,
      html: `
        <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #0d131f; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #1f293d;">
          <div style="background: linear-gradient(135deg, #00f0ff 0%, #0070f3 100%); padding: 24px; text-align: center;">
            <h1 style="margin: 0; color: #000000; font-size: 24px; font-weight: 900; letter-spacing: 1px;">GAGAN MOBILE CARE</h1>
            <p style="margin: 4px 0 0 0; color: #000000; font-size: 12px; font-weight: 600;">Maur Mandi, Punjab • Official Mobile Care</p>
          </div>
          <div style="padding: 30px 24px; text-align: center;">
            <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Email Verification Code</h2>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
              Please use the following 6-digit verification code to complete your ${purpose || 'login/registration'} for Gagan Mobile Care.
            </p>
            <div style="margin: 28px 0; padding: 18px; background: #080b11; border: 2px dashed #00f0ff; border-radius: 12px; display: inline-block;">
              <span style="font-family: monospace; font-size: 36px; font-weight: 900; color: #00f0ff; letter-spacing: 8px;">
                ${otp}
              </span>
            </div>
            <p style="color: #f59e0b; font-size: 12px; margin: 0;">
              ⏳ This code is valid for 5 minutes. Do not share this OTP with anyone.
            </p>
          </div>
          <div style="background-color: #080b11; padding: 16px 24px; text-align: center; border-top: 1px solid #1f293d;">
            <p style="color: #64748b; font-size: 11px; margin: 0;">
              Need help? Call Gagan Mobile Care at <strong>+91 98726-22624</strong>
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    res.json({
      success: true,
      message: `OTP sent successfully to ${email}`,
      previewUrl: previewUrl || null,
      isLiveSmtp: Boolean(smtpUser && smtpPass),
      code: !smtpUser ? otp : undefined
    });
  } catch (err) {
    console.error('Failed to send mail:', err);
    res.status(500).json({ error: err.message || 'Failed to dispatch email.' });
  }
});

// ----------------------------------------------------
// 1. PRODUCTS API
// ----------------------------------------------------
app.get('/api/products', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    const formatted = result.rows.map((p) => ({
      id: p.id,
      name: p.name,
      subtitle: p.subtitle,
      brand: p.brand,
      category: p.category,
      price: parseFloat(p.price),
      originalPrice: p.original_price ? parseFloat(p.original_price) : parseFloat(p.price),
      rating: parseFloat(p.rating),
      reviewsCount: p.reviews_count,
      image: p.image,
      inStock: p.in_stock,
      isNew: p.is_new,
      specs: p.specs
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const p = req.body;
    const result = await pool.query(
      `INSERT INTO products (id, name, subtitle, brand, category, price, original_price, rating, reviews_count, image, in_stock, is_new, specs)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        p.id || 'prod_' + Date.now(),
        p.name,
        p.subtitle || '',
        p.brand,
        p.category || 'smartphones',
        p.price,
        p.originalPrice || p.price,
        p.rating || 4.8,
        p.reviewsCount || 10,
        p.image,
        p.inStock ?? true,
        p.isNew ?? true,
        JSON.stringify(p.specs || {})
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { id } = req.params;
    const updates = req.body;

    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.price !== undefined) {
      fields.push(`price = $${idx++}`);
      values.push(updates.price);
    }
    if (updates.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(updates.name);
    }
    if (updates.inStock !== undefined) {
      fields.push(`in_stock = $${idx++}`);
      values.push(updates.inStock);
    }
    if (updates.image !== undefined) {
      fields.push(`image = $${idx++}`);
      values.push(updates.image);
    }

    if (fields.length === 0) return res.json({ message: 'No updates provided' });

    values.push(id);
    const result = await pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 2. ORDERS API
// ----------------------------------------------------
app.get('/api/orders', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { user_id, email } = req.query;

    let query = 'SELECT * FROM orders ORDER BY created_at DESC';
    let params = [];

    if (user_id || email) {
      query = 'SELECT * FROM orders WHERE user_id = $1 OR customer_email = $2 ORDER BY created_at DESC';
      params = [user_id || '', (email || '').toLowerCase()];
    }

    const result = await pool.query(query, params);
    const formatted = result.rows.map((o) => ({
      id: o.id,
      userId: o.user_id,
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      customerPhone: o.customer_phone,
      items: o.items,
      total: parseFloat(o.total_amount),
      paymentMethod: o.payment_method,
      status: o.status,
      shippingAddress: o.shipping_address,
      date: o.date
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const o = req.body;
    const result = await pool.query(
      `INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone, items, total_amount, payment_method, status, shipping_address, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        o.id || 'GMC-' + Math.floor(10000 + Math.random() * 90000),
        o.userId || null,
        o.customerName || 'Customer',
        (o.customerEmail || '').toLowerCase(),
        o.customerPhone || '+91 98726-22624',
        JSON.stringify(o.items || []),
        o.total || 0,
        o.paymentMethod || 'Cash on Delivery',
        o.status || 'Confirmed',
        o.shippingAddress || 'Maur Mandi, Punjab',
        o.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 3. USERS & AUTH API
// ----------------------------------------------------
app.get('/api/users', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const result = await pool.query('SELECT id, name, email, phone, role, avatar, address, is_email_verified, provider, created_at, last_login_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all login audit sessions
app.get('/api/logins', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const result = await pool.query('SELECT * FROM login_sessions ORDER BY login_time DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/sessions', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const result = await pool.query('SELECT * FROM login_sessions ORDER BY login_time DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Explicitly record a user login event from frontend
app.post('/api/auth/record-login', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { userId, name, email, role, deviceInfo } = req.body || {};
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

    const newSession = await pool.query(
      `INSERT INTO login_sessions (id, user_id, user_name, user_email, role, ip_address, device_info, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        'sess_' + Date.now(),
        userId || 'usr_guest',
        name || 'Customer',
        email || 'unknown@example.com',
        role || 'user',
        typeof ip === 'string' ? ip.split(',')[0].trim() : '127.0.0.1',
        deviceInfo || req.headers['user-agent'] || 'Chrome Web Client',
        'Authenticated'
      ]
    );

    if (userId) {
      await pool.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [userId]);
    } else if (email) {
      await pool.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE email = $1', [email]);
    }

    res.status(201).json(newSession.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { name, email, phone, password, role, avatar } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email is already registered.' });
    }

    const userId = 'usr_' + Date.now();
    const newUser = await pool.query(
      `INSERT INTO users (id, name, email, phone, password, role, avatar, address, is_email_verified, provider, last_login_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
       RETURNING id, name, email, phone, role, avatar, address, is_email_verified, provider, created_at, last_login_at`,
      [
        userId,
        name.trim(),
        normalizedEmail,
        phone ? phone.trim() : '+91 98765 00000',
        password,
        role || 'user',
        avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        'Maur Mandi, Punjab',
        true,
        'email'
      ]
    );

    // Record login session
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    await pool.query(
      `INSERT INTO login_sessions (id, user_id, user_name, user_email, role, ip_address, device_info, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        'sess_' + Date.now(),
        userId,
        name.trim(),
        normalizedEmail,
        role || 'user',
        typeof ip === 'string' ? ip.split(',')[0].trim() : '127.0.0.1',
        req.headers['user-agent'] || 'Web Registration',
        'Registered & Authenticated'
      ]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { email, password } = req.body;
    const normalized = (email || '').trim().toLowerCase();

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR phone = $2',
      [normalized, email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    // Update last_login_at
    await pool.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    // Record login session
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    await pool.query(
      `INSERT INTO login_sessions (id, user_id, user_name, user_email, role, ip_address, device_info, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        'sess_' + Date.now(),
        user.id,
        user.name,
        user.email,
        user.role || 'user',
        typeof ip === 'string' ? ip.split(',')[0].trim() : '127.0.0.1',
        req.headers['user-agent'] || 'Web Client',
        'Authenticated'
      ]
    );

    const { password: _, ...safeUser } = user;
    res.json({ ...safeUser, last_login_at: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/profile', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { id, name, phone, address, avatar } = req.body;
    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           address = COALESCE($3, address),
           avatar = COALESCE($4, avatar)
       WHERE id = $5
       RETURNING id, name, email, phone, role, avatar, address, is_email_verified, provider, last_login_at`,
      [name, phone, address, avatar, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 4. CUSTOMER STORIES API
// ----------------------------------------------------
app.get('/api/stories', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const result = await pool.query('SELECT * FROM customer_stories ORDER BY created_at DESC');
    
    const formatted = result.rows.map((s) => {
      const device = s.device_name || '';
      let brand = s.brand;
      if (!brand || brand === 'all') {
        const lower = device.toLowerCase();
        if (lower.includes('iphone') || lower.includes('apple')) brand = 'apple';
        else if (lower.includes('vivo')) brand = 'vivo';
        else if (lower.includes('iqoo')) brand = 'iqoo';
        else if (lower.includes('samsung')) brand = 'samsung';
        else if (lower.includes('oneplus')) brand = 'oneplus';
        else brand = 'all';
      }

      return {
        id: s.id,
        customerName: s.customer_name,
        customer_name: s.customer_name,
        phoneBought: s.device_name,
        deviceName: s.device_name,
        device_name: s.device_name,
        brand: brand,
        tag: s.tag || 'Verified Buyer',
        feedback: s.review,
        review: s.review,
        storeLocation: s.location,
        location: s.location,
        rating: parseFloat(s.rating) || 5.0,
        image: s.image,
        date: s.date || 'Recent Delivery',
        verified: s.verified_purchase ?? true,
        verifiedPurchase: s.verified_purchase ?? true,
        verified_purchase: s.verified_purchase ?? true,
        createdAt: s.created_at
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stories', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const s = req.body;
    const deviceName = s.phoneBought || s.deviceName || s.device_name || 'Smartphone Purchase';
    const customerName = s.customerName || s.customer_name || 'Customer';
    const location = s.storeLocation || s.location || 'GMC Retail Hub, Maur Mandi';
    const review = s.feedback || s.review || 'Excellent service & genuine sealed pack purchase from Gagan Mobile Care.';
    const rating = parseFloat(s.rating) || 5.0;
    const brand = s.brand || (deviceName.toLowerCase().includes('iphone') ? 'apple' : deviceName.toLowerCase().includes('vivo') ? 'vivo' : deviceName.toLowerCase().includes('iqoo') ? 'iqoo' : 'all');
    const tag = s.tag || (rating === 5 ? 'Top Rating' : 'Verified Buyer');
    const image = s.image || '/customers/customer_store_owner.png';
    const date = s.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const verified = s.verified ?? s.verifiedPurchase ?? s.verified_purchase ?? true;

    const result = await pool.query(
      `INSERT INTO customer_stories (id, customer_name, location, device_name, brand, tag, review, rating, image, date, verified_purchase)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        s.id || 'story_' + Date.now(),
        customerName,
        location,
        deviceName,
        brand,
        tag,
        review,
        rating,
        image,
        date,
        verified
      ]
    );

    const inserted = result.rows[0];
    res.status(201).json({
      id: inserted.id,
      customerName: inserted.customer_name,
      customer_name: inserted.customer_name,
      phoneBought: inserted.device_name,
      deviceName: inserted.device_name,
      device_name: inserted.device_name,
      brand: inserted.brand,
      tag: inserted.tag,
      feedback: inserted.review,
      review: inserted.review,
      storeLocation: inserted.location,
      location: inserted.location,
      rating: parseFloat(inserted.rating),
      image: inserted.image,
      date: inserted.date,
      verified: inserted.verified_purchase,
      verifiedPurchase: inserted.verified_purchase,
      verified_purchase: inserted.verified_purchase,
      createdAt: inserted.created_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stories/:id', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { id } = req.params;
    await pool.query('DELETE FROM customer_stories WHERE id = $1', [id]);
    res.json({ success: true, message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 5. USER CART & WISHLIST API
// ----------------------------------------------------
app.get('/api/cart/:userId', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { userId } = req.params;
    const result = await pool.query('SELECT items FROM user_carts WHERE user_id = $1', [userId]);
    res.json(result.rows[0] ? result.rows[0].items : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cart/:userId', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { userId } = req.params;
    const { items } = req.body;
    await pool.query(
      `INSERT INTO user_carts (user_id, items, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) DO UPDATE SET items = $2, updated_at = CURRENT_TIMESTAMP`,
      [userId, JSON.stringify(items || [])]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/wishlist/:userId', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { userId } = req.params;
    const result = await pool.query('SELECT items FROM user_wishlists WHERE user_id = $1', [userId]);
    res.json(result.rows[0] ? result.rows[0].items : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wishlist/:userId', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    const { userId } = req.params;
    const { items } = req.body;
    await pool.query(
      `INSERT INTO user_wishlists (user_id, items, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) DO UPDATE SET items = $2, updated_at = CURRENT_TIMESTAMP`,
      [userId, JSON.stringify(items || [])]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// START SERVER AND AUTO-INIT DATABASE
const server = app.listen(PORT, async () => {
  console.log(`🚀 Gagan Mobile Care PostgreSQL Backend listening on http://localhost:${PORT}`);
  await initDatabase();
});

// Auto-reconnect heartbeat to PostgreSQL every 10 seconds if offline
setInterval(async () => {
  if (!isDbConnected()) {
    const connected = await testConnection();
    if (connected) {
      console.log('🔄 PostgreSQL database reconnected! Initializing schema...');
      await initDatabase();
    }
  }
}, 10000);

export default app;
