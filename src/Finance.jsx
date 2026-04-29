import { useState, useEffect } from 'react';
import './Finance.css';

const BUDGET_TOTAL = 26200;
const TARGET_SAVE = 9000;
const DAYS_IN_MONTH = 31;

const CATS = {
  food:  { label: 'خوراکی و قهوه',   budget: 1000,  color: '#a78bfa' },
  home:  { label: 'خرج خونه',         budget: 3000,  color: '#60a5fa' },
  sig:   { label: 'سیگار',            budget: 3200,  color: '#f87171' },
  net:   { label: 'اینترنت و بنزین',  budget: 1000,  color: '#fbbf24' },
  fun:   { label: 'تفریح',            budget: 4000,  color: '#34d399' },
  gift:  { label: 'کادو دوست دختر',   budget: 5000,  color: '#f472b6' },
  sub:   { label: 'اشتراک‌ها',        budget: null,  color: '#38bdf8' },
  gym:   { label: 'باشگاه',           budget: 0,     color: '#fb923c' },
  other: { label: 'سایر',             budget: null,  color: '#94a3b8' },
};

const FIXED_COSTS = [
  { name: 'بدهی',       note: 'پرداخت یک‌باره این ماه', amount: 20000, color: '#f87171' },
  { name: 'قسط اسنپ‌پی', note: 'قسط ماهانه',            amount: 2400,  color: '#fbbf24' },
  { name: 'قسط دوم',    note: 'قسط ماهانه',            amount: 2500,  color: '#fbbf24' },
  { name: 'بیمه ماشین', note: 'قسط ماهانه',            amount: 1100,  color: '#fbbf24' },
  { name: 'VM Hetzner', note: 'اشتراک ماهانه',          amount: 800,   color: '#fbbf24' },
];

async function apiFetch(url, opts = {}) {
  const res = await fetch(url, { credentials: 'include', ...opts });
  if (res.status === 401) return { __unauthorized: true };
  return res.ok ? res.json() : null;
}

function toFa(n) {
  return String(n).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
}

function fmtK(v) {
  const abs = Math.abs(v);
  if (abs >= 1000) return toFa((v / 1000).toFixed(1).replace('.0', '')) + ' M';
  return toFa(Math.round(v)) + ' K';
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function dayOfMonth() {
  const base = new Date('2026-04-25');
  base.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today - base) / 86400000);
  return Math.min(DAYS_IN_MONTH, Math.max(1, 5 + diff));
}

export default function Finance() {
  const [auth,     setAuth]     = useState('loading'); // 'loading' | 'login' | 'ready'
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginErr,  setLoginErr]  = useState('');

  const [expenses, setExpenses] = useState([]);
  const [incomes,  setIncomes]  = useState([]);

  const [desc,    setDesc]    = useState('');
  const [cat,     setCat]     = useState('food');
  const [amt,     setAmt]     = useState('');
  const [incDesc, setIncDesc] = useState('');
  const [incAmt,  setIncAmt]  = useState('');
  const [amtErr,  setAmtErr]  = useState(false);
  const [incErr,  setIncErr]  = useState(false);

  async function loadData() {
    const [exp, inc] = await Promise.all([
      apiFetch('/api/expenses'),
      apiFetch('/api/incomes'),
    ]);
    if (exp?.__unauthorized || inc?.__unauthorized) {
      setAuth('login');
      return;
    }
    if (exp) setExpenses(exp);
    if (inc) setIncomes(inc);
    setAuth('ready');
  }

  useEffect(() => { loadData(); }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginErr('');
    const res = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUser, password: loginPass }),
    });
    const data = await res.json();
    if (data.ok) {
      setLoginUser('');
      setLoginPass('');
      setAuth('loading');
      loadData();
    } else {
      setLoginErr(data.error || 'خطای ورود');
    }
  }

  const day      = dayOfMonth();
  const spent    = expenses.reduce((s, e) => s + e.amount, 0);
  const extraInc = incomes.reduce((s, e) => s + e.amount, 0);
  const effectiveBudget = BUDGET_TOTAL + extraInc;
  const remain   = effectiveBudget - spent;
  const pct      = Math.min(100, Math.round((spent / effectiveBudget) * 100));
  const daysLeft = DAYS_IN_MONTH - day + 1;
  const dailyAllowed = daysLeft > 0 ? Math.max(0, remain / daysLeft) : 0;
  const onTrack  = remain >= TARGET_SAVE;

  const fixedTotal = FIXED_COSTS.reduce((s, f) => s + f.amount, 0);

  async function addExpense() {
    const a = parseFloat(amt);
    if (!desc.trim() || !a || a <= 0) {
      setAmtErr(true);
      setTimeout(() => setAmtErr(false), 1000);
      return;
    }
    const data = await apiFetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desc: desc.trim(), cat, amount: a, day, date: todayStr() }),
    });
    if (data?.__unauthorized) { setAuth('login'); return; }
    if (data?.id) {
      setExpenses([{ id: data.id, desc: desc.trim(), cat, amount: a, day, date: todayStr() }, ...expenses]);
      setDesc('');
      setAmt('');
    }
  }

  async function addIncome() {
    const a = parseFloat(incAmt);
    if (!incDesc.trim() || !a || a <= 0) {
      setIncErr(true);
      setTimeout(() => setIncErr(false), 1000);
      return;
    }
    const data = await apiFetch('/api/incomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desc: incDesc.trim(), amount: a, day, date: todayStr() }),
    });
    if (data?.__unauthorized) { setAuth('login'); return; }
    if (data?.id) {
      setIncomes([{ id: data.id, desc: incDesc.trim(), amount: a, day, date: todayStr() }, ...incomes]);
      setIncDesc('');
      setIncAmt('');
    }
  }

  async function delExpense(id) {
    const data = await apiFetch(`/api/expenses/${id}`, { method: 'DELETE' });
    if (data?.__unauthorized) { setAuth('login'); return; }
    setExpenses(expenses.filter(e => e.id !== id));
  }

  async function delIncome(id) {
    const data = await apiFetch(`/api/incomes/${id}`, { method: 'DELETE' });
    if (data?.__unauthorized) { setAuth('login'); return; }
    setIncomes(incomes.filter(e => e.id !== id));
  }

  async function resetAll() {
    if (!confirm('مطمئنی؟ همه خرج‌ها و درآمدهای این ماه پاک می‌شن.')) return;
    await Promise.all([
      apiFetch('/api/expenses', { method: 'DELETE' }),
      apiFetch('/api/incomes',  { method: 'DELETE' }),
    ]);
    setExpenses([]);
    setIncomes([]);
  }

  function spentByCat(catKey) {
    return expenses.filter(e => e.cat === catKey).reduce((s, e) => s + e.amount, 0);
  }

  function spentByDay(d) {
    return expenses.filter(e => e.day === d).reduce((s, e) => s + e.amount, 0);
  }

  const ringOffset = 314 - (314 * pct / 100);
  const ringColor  = pct > 80 ? 'var(--fin-red)' : pct > 60 ? 'var(--fin-amber)' : 'var(--fin-accent)';

  let pillColor, pillText;
  if (remain < 0)   { pillColor = 'var(--fin-red)';   pillText = 'از بودجه رد شدی!'; }
  else if (pct > 75){ pillColor = 'var(--fin-amber)';  pillText = 'نزدیک سقف بودجه'; }
  else               { pillColor = 'var(--fin-green)';  pillText = 'وضعیت خوبه'; }

  const maxDaySpent = Math.max(...Array.from({ length: 31 }, (_, i) => spentByDay(i + 1)), 1);
  const subItems = expenses.filter(e => e.cat === 'sub');
  const subTotal = subItems.reduce((s, e) => s + e.amount, 0);
  const incTotal = incomes.reduce((s, e) => s + e.amount, 0);

  if (auth === 'loading') return (
    <div className="fin"><div className="fin__bg-grid" /><div className="fin__wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ color: 'var(--fin-muted)', fontSize: 14 }}>در حال بارگذاری...</div>
    </div></div>
  );

  if (auth === 'login') return (
    <div className="fin"><div className="fin__bg-grid" /><div className="fin__wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <form onSubmit={handleLogin} style={{ background: 'var(--fin-s2)', border: '1px solid var(--fin-border)', borderRadius: 16, padding: '32px 28px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ color: 'var(--fin-text)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>ورود به ردیاب مخارج</div>
        {loginErr && <div style={{ color: 'var(--fin-red)', fontSize: 12 }}>{loginErr}</div>}
        <input type="text" placeholder="نام کاربری" value={loginUser} onChange={e => setLoginUser(e.target.value)} autoFocus />
        <input type="password" placeholder="رمز عبور" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
        <button type="submit" className="fin__btn-add" style={{ width: '100%' }}>ورود</button>
      </form>
    </div></div>
  );

  return (
    <div className="fin">
      <div className="fin__bg-grid" />
      <div className="fin__wrap">

        {/* HEADER */}
        <div className="fin__header">
          <div>
            <div className="fin__header-label">ردیاب مخارج</div>
            <div className="fin__header-title">اردیبهشت ۱۴۰۵</div>
          </div>
          <div className="fin__header-right">
            <button className="fin__reset-btn" onClick={resetAll}>ریست ماه</button>
            <div className="fin__day-badge">روز <b>{toFa(day)}</b> از ۳۱</div>
          </div>
        </div>

        {/* INCOME & FIXED COSTS OVERVIEW */}
        <div className="fin__card">
          <div className="fin__card-title">تصویر کلی ماه — اردیبهشت ۱۴۰۵</div>
          <div className="fin__overview-grid">
            <div>
              <div className="fin__overview-label">درآمد ماهانه</div>
              <div className="fin__income-big">۵۳ M</div>
              <div className="fin__income-sub">حقوق اردیبهشت</div>
              <div style={{ marginTop: 14 }}>
                <div className="fin__overview-row">
                  <span className="c-fin-muted">هزینه‌های ثابت</span>
                  <span className="c-fin-red" style={{ fontWeight: 500 }}>۲۶.۸ M</span>
                </div>
                <div className="fin__overview-row">
                  <span className="c-fin-muted">بودجه آزاد</span>
                  <span className="c-fin-accent" style={{ fontWeight: 500 }}>۲۶.۲ M</span>
                </div>
              </div>
              <div className="fin__income-bar">
                <div className="fin__income-bar-track">
                  <div className="fin__income-bar-fixed" />
                  <div className="fin__income-bar-free" />
                </div>
                <div className="fin__income-bar-legend">
                  <span><span style={{ color: 'var(--fin-red)' }}>■</span> ثابت ۵۰.۶٪</span>
                  <span><span style={{ color: 'var(--fin-accent)' }}>■</span> آزاد ۴۹.۴٪</span>
                </div>
              </div>
            </div>
            <div>
              <div className="fin__overview-label">جزئیات هزینه‌های ثابت</div>
              <div className="fin__fixed-list">
                {FIXED_COSTS.map(f => (
                  <div key={f.name} className="fin__fixed-item">
                    <div>
                      <div className="fin__fixed-name">{f.name}</div>
                      <div className="fin__fixed-note">{f.note}</div>
                    </div>
                    <span style={{ color: f.color, fontWeight: 700 }}>{fmtK(f.amount)}</span>
                  </div>
                ))}
                <div className="fin__fixed-total">
                  <span className="c-fin-muted">جمع کل</span>
                  <span className="c-fin-red" style={{ fontWeight: 700 }}>{fmtK(fixedTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="fin__stats">
          <div className="fin__stat">
            <div className="fin__stat-label">بودجه آزاد ماهانه</div>
            <div className="fin__stat-value c-fin-accent">{fmtK(effectiveBudget)}</div>
            <div className="fin__stat-sub">
              {extraInc > 0
                ? `پایه ۲۶.۲M + ${fmtK(extraInc)} درآمد موردی`
                : 'بعد از هزینه‌های ثابت'}
            </div>
          </div>
          <div className="fin__stat">
            <div className="fin__stat-label">خرج‌شده تاکنون</div>
            <div className="fin__stat-value c-fin-red">{fmtK(spent)}</div>
            <div className="fin__stat-sub">{toFa(pct)}٪ از بودجه</div>
          </div>
          <div className="fin__stat">
            <div className="fin__stat-label">باقیمانده</div>
            <div className="fin__stat-value c-fin-green">{fmtK(Math.max(0, remain))}</div>
            <div className="fin__stat-sub">روزانه مجاز: {fmtK(dailyAllowed)}</div>
          </div>
          <div className="fin__stat">
            <div className="fin__stat-label">پس‌انداز هدف</div>
            <div className="fin__stat-value c-fin-blue">۹ M</div>
            <div className="fin__stat-sub" style={{ color: onTrack ? 'var(--fin-green)' : 'var(--fin-red)' }}>
              {onTrack ? 'در مسیر ✓' : 'خطر! ✗'}
            </div>
          </div>
        </div>

        {/* EXPENSE FORM */}
        <div className="fin__card">
          <div className="fin__card-title">ثبت خرج جدید</div>
          <div className="fin__form-row">
            <input
              type="text"
              placeholder="توضیح (مثلاً: قهوه با دوست)"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('fin-amt').focus()}
            />
            <select value={cat} onChange={e => setCat(e.target.value)}>
              {Object.entries(CATS).map(([key, c]) => (
                <option key={key} value={key}>{c.label}</option>
              ))}
            </select>
            <input
              id="fin-amt"
              type="number"
              placeholder="مبلغ (هزار تومن)"
              min="0"
              value={amt}
              className={amtErr ? 'fin__input--error' : ''}
              onChange={e => setAmt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addExpense()}
            />
            <button className="fin__btn-add" onClick={addExpense}>+ ثبت</button>
          </div>
        </div>

        {/* INCOME FORM */}
        <div className="fin__card" style={{ borderColor: 'rgba(52,211,153,0.2)' }}>
          <div className="fin__income-card-header">
            <div className="fin__card-title" style={{ marginBottom: 0, color: 'var(--fin-green)' }}>ثبت درآمد موردی</div>
            <div style={{ fontSize: 11, color: 'var(--fin-muted)' }}>اضافه به بودجه آزاد می‌شه</div>
          </div>
          <div className="fin__form-row">
            <input
              type="text"
              placeholder="توضیح (مثلاً: پاداش، فریلنس، ...)"
              value={incDesc}
              onChange={e => setIncDesc(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('fin-inc-amt').focus()}
            />
            <input
              id="fin-inc-amt"
              type="number"
              placeholder="مبلغ (هزار تومن)"
              min="0"
              value={incAmt}
              className={incErr ? 'fin__input--error' : ''}
              style={{ borderColor: incErr ? undefined : 'rgba(52,211,153,0.3)' }}
              onChange={e => setIncAmt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addIncome()}
            />
            <button className="fin__btn-add fin__btn-add--green" onClick={addIncome}>+ درآمد</button>
          </div>
        </div>

        {/* MAIN GRID: CATEGORIES + STATUS RING */}
        <div className="fin__main-grid">

          {/* CATEGORIES */}
          <div className="fin__card">
            <div className="fin__card-title">بودجه دسته‌بندی‌ها</div>
            {Object.entries(CATS).map(([key, c]) => {
              const s = spentByCat(key);
              if (c.budget === 0 && s === 0) return null;
              const barPct   = c.budget > 0 ? Math.min(100, (s / c.budget) * 100) : s > 0 ? 100 : 0;
              const barColor = barPct > 90 ? 'var(--fin-red)' : barPct > 70 ? 'var(--fin-amber)' : c.color;
              return (
                <div key={key} className="fin__cat">
                  <div className="fin__cat-head">
                    <span style={{ color: 'var(--fin-text)' }}>{c.label}</span>
                    <div className="fin__cat-nums">
                      <span className="fin__cat-spent" style={{ color: c.color }}>{fmtK(s)}</span>
                      <span className="fin__cat-budget">/ {c.budget > 0 ? fmtK(c.budget) : '—'}</span>
                    </div>
                  </div>
                  <div className="fin__bar-bg">
                    <div className="fin__bar-fill" style={{ width: `${barPct}%`, background: barColor }} />
                  </div>
                </div>
              );
            })}
            {expenses.length === 0 && (
              <div className="fin__empty-log">هنوز خرجی نداری</div>
            )}
          </div>

          {/* STATUS RING */}
          <div className="fin__card">
            <div className="fin__card-title">وضعیت کلی</div>
            <div
              className="fin__status-pill"
              style={{ background: `${pillColor}20`, color: pillColor, border: `1px solid ${pillColor}40` }}
            >
              <span className="fin__status-dot" style={{ background: pillColor }} />
              {pillText}
            </div>
            <div className="fin__ring-wrap">
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ display: 'block', margin: '0 auto 8px' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1a1a22" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="314"
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
                <text x="60" y="56" textAnchor="middle" fontFamily="Vazirmatn" fontSize="15" fontWeight="700" fill="#ededf5">
                  {toFa(pct)}٪
                </text>
                <text x="60" y="72" textAnchor="middle" fontFamily="Vazirmatn" fontSize="9" fill="#7a789a">
                  خرج‌شده
                </text>
              </svg>
            </div>
            <hr className="fin__divider" />
            <div className="fin__summary-row"><span>بودجه کل متغیر</span><span className="c-fin-accent">{fmtK(effectiveBudget)}</span></div>
            <div className="fin__summary-row"><span>خرج‌شده</span><span className="c-fin-red">{fmtK(spent)}</span></div>
            <div className="fin__summary-row"><span>باقیمانده</span><span className="c-fin-green">{fmtK(Math.max(0, remain))}</span></div>
            <hr className="fin__divider" />
            <div className="fin__summary-row"><span>هدف پس‌انداز</span><span className="c-fin-blue">۹ M</span></div>
            <div className="fin__summary-row">
              <span>وضعیت پس‌انداز</span>
              <span style={{ color: onTrack ? 'var(--fin-green)' : 'var(--fin-red)' }}>
                {onTrack ? 'در مسیر ✓' : 'در خطر ✗'}
              </span>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="fin__card">
          <div className="fin__timeline-header">
            <div className="fin__card-title" style={{ marginBottom: 0 }}>خرج روزانه</div>
            <div style={{ fontSize: 11, color: 'var(--fin-muted)' }}>هر ستون = یک روز</div>
          </div>
          <div className="fin__timeline">
            {Array.from({ length: 31 }, (_, i) => {
              const d = i + 1;
              const v = spentByDay(d);
              const h = v > 0 ? Math.max(4, Math.round((v / maxDaySpent) * 56)) : 3;
              const isToday = d === day;
              const fillCol = v > 0 ? (isToday ? 'var(--fin-accent)' : 'var(--fin-blue)') : 'var(--fin-s3)';
              return (
                <div
                  key={d}
                  className="fin__tl-bar"
                  style={{ height: h, background: fillCol, opacity: d > day ? 0.3 : 1 }}
                  data-tip={`روز ${toFa(d)}: ${fmtK(v)}`}
                />
              );
            })}
          </div>
          <div className="fin__timeline-footer">
            <span>روز ۱</span><span>روز ۱۰</span><span>روز ۲۰</span><span>روز ۳۱</span>
          </div>
        </div>

        {/* EXPENSE LOG */}
        <div className="fin__card">
          <div className="fin__log-header">
            <div className="fin__card-title" style={{ marginBottom: 0 }}>تاریخچه خرج‌ها</div>
            <div style={{ fontSize: 11, color: 'var(--fin-muted)' }}>{toFa(expenses.length)} تراکنش</div>
          </div>
          <div className="fin__log-list">
            {expenses.length === 0 ? (
              <div className="fin__empty-log">
                هنوز خرجی ثبت نشده<br />
                <span style={{ fontSize: 10 }}>از فرم بالا شروع کن</span>
              </div>
            ) : expenses.map(e => {
              const c = CATS[e.cat];
              return (
                <div key={e.id} className="fin__log-item">
                  <div className="fin__log-left">
                    <div className="fin__log-desc">{e.desc}</div>
                    <div className="fin__log-meta" style={{ color: c.color }}>{c.label} · روز {toFa(e.day)}</div>
                  </div>
                  <div className="fin__log-right">
                    <span className="fin__log-amount">{fmtK(e.amount)}</span>
                    <button className="fin__log-del" onClick={() => delExpense(e.id)}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUBSCRIPTION LOG */}
        <div className="fin__card" style={{ borderColor: 'rgba(56,189,248,0.2)' }}>
          <div className="fin__log-header">
            <div className="fin__card-title" style={{ marginBottom: 0, color: '#38bdf8' }}>اشتراک‌های این ماه</div>
            <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 500 }}>جمع: {fmtK(subTotal)}</div>
          </div>
          <div className="fin__log-list">
            {subItems.length === 0 ? (
              <div className="fin__empty-log">هنوز اشتراکی ثبت نشده</div>
            ) : subItems.map(e => (
              <div key={e.id} className="fin__log-item" style={{ borderRight: '2px solid #38bdf8' }}>
                <div className="fin__log-left">
                  <div className="fin__log-desc">{e.desc}</div>
                  <div className="fin__log-meta" style={{ color: '#38bdf8' }}>اشتراک · روز {toFa(e.day)}</div>
                </div>
                <div className="fin__log-right">
                  <span className="fin__log-amount" style={{ color: '#38bdf8' }}>{fmtK(e.amount)}</span>
                  <button className="fin__log-del" onClick={() => delExpense(e.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INCOME LOG */}
        <div className="fin__card" style={{ borderColor: 'rgba(52,211,153,0.15)' }}>
          <div className="fin__log-header">
            <div className="fin__card-title" style={{ marginBottom: 0, color: 'var(--fin-green)' }}>درآمدهای موردی این ماه</div>
            <div style={{ fontSize: 11, color: 'var(--fin-green)', fontWeight: 500 }}>جمع: {fmtK(incTotal)}</div>
          </div>
          <div className="fin__log-list">
            {incomes.length === 0 ? (
              <div className="fin__empty-log">هنوز درآمد موردی ثبت نشده</div>
            ) : incomes.map(e => (
              <div key={e.id} className="fin__log-item" style={{ borderRight: '2px solid var(--fin-green)' }}>
                <div className="fin__log-left">
                  <div className="fin__log-desc">{e.desc}</div>
                  <div className="fin__log-meta" style={{ color: 'var(--fin-green)' }}>درآمد موردی · روز {toFa(e.day)}</div>
                </div>
                <div className="fin__log-right">
                  <span className="fin__log-amount" style={{ color: 'var(--fin-green)' }}>+{fmtK(e.amount)}</span>
                  <button className="fin__log-del" onClick={() => delIncome(e.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
