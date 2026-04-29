// Load .env if present (optional — can also pass vars via shell)
try { require('fs').readFileSync('.env', 'utf8').split('\n').forEach(l => {
  const [k, ...v] = l.trim().split('=');
  if (k && !k.startsWith('#') && !(k in process.env)) process.env[k] = v.join('=');
}); } catch {}

const express = require('express');
const session = require('express-session');
const crypto  = require('crypto');
const db      = require('./db');

const app  = express();
const PORT = Number(process.env.PORT) || 4000;

const FINANCE_USER      = process.env.FINANCE_USER      || 'mahdi';
const FINANCE_PASS_HASH = process.env.FINANCE_PASS_HASH || '';
const SESSION_SECRET    = process.env.SESSION_SECRET    || 'dev-secret-replace-in-prod';

function checkPassword(plain) {
  const hash = crypto.createHash('sha256').update(plain).digest('hex');
  return FINANCE_PASS_HASH.length > 0 && hash === FINANCE_PASS_HASH;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 },
}));

// ── Auth middleware ───────────────────────────────────────────────────────────

function requireApiAuth(req, res, next) {
  if (req.session.authenticated) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// ── Auth API ─────────────────────────────────────────────────────────────────

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === FINANCE_USER && checkPassword(password)) {
    req.session.authenticated = true;
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false, error: 'نام کاربری یا رمز عبور اشتباه است' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// ── Data API (requires auth) ──────────────────────────────────────────────────

app.get('/api/expenses', requireApiAuth, (_req, res) => {
  res.json(db.getExpenses());
});

app.post('/api/expenses', requireApiAuth, (req, res) => {
  const { desc, cat, amount, day, date } = req.body;
  if (!desc || !cat || !amount || !day || !date)
    return res.status(400).json({ error: 'Missing fields' });
  const id = db.addExpense({ desc, cat, amount: Number(amount), day: Number(day), date });
  res.json({ id });
});

app.delete('/api/expenses', requireApiAuth, (_req, res) => {
  db.clearExpenses();
  res.json({ ok: true });
});

app.delete('/api/expenses/:id', requireApiAuth, (req, res) => {
  db.deleteExpense(Number(req.params.id));
  res.json({ ok: true });
});

app.get('/api/incomes', requireApiAuth, (_req, res) => {
  res.json(db.getIncomes());
});

app.post('/api/incomes', requireApiAuth, (req, res) => {
  const { desc, amount, day, date } = req.body;
  if (!desc || !amount || !day || !date)
    return res.status(400).json({ error: 'Missing fields' });
  const id = db.addIncome({ desc, amount: Number(amount), day: Number(day), date });
  res.json({ id });
});

app.delete('/api/incomes', requireApiAuth, (_req, res) => {
  db.clearIncomes();
  res.json({ ok: true });
});

app.delete('/api/incomes/:id', requireApiAuth, (req, res) => {
  db.deleteIncome(Number(req.params.id));
  res.json({ ok: true });
});

// ── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Finance backend → http://127.0.0.1:${PORT}`);
});
