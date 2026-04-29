const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'finance.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    desc      TEXT    NOT NULL,
    cat       TEXT    NOT NULL,
    amount    REAL    NOT NULL,
    day       INTEGER NOT NULL,
    date      TEXT    NOT NULL,
    created_at TEXT   DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS incomes (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    desc      TEXT    NOT NULL,
    amount    REAL    NOT NULL,
    day       INTEGER NOT NULL,
    date      TEXT    NOT NULL,
    created_at TEXT   DEFAULT (datetime('now'))
  );
`);

const stmts = {
  getExpenses:   db.prepare('SELECT * FROM expenses ORDER BY id DESC'),
  addExpense:    db.prepare('INSERT INTO expenses (desc, cat, amount, day, date) VALUES (@desc, @cat, @amount, @day, @date)'),
  deleteExpense: db.prepare('DELETE FROM expenses WHERE id = ?'),
  clearExpenses: db.prepare('DELETE FROM expenses'),

  getIncomes:    db.prepare('SELECT * FROM incomes ORDER BY id DESC'),
  addIncome:     db.prepare('INSERT INTO incomes (desc, amount, day, date) VALUES (@desc, @amount, @day, @date)'),
  deleteIncome:  db.prepare('DELETE FROM incomes WHERE id = ?'),
  clearIncomes:  db.prepare('DELETE FROM incomes'),
};

module.exports = {
  getExpenses:   () => stmts.getExpenses.all(),
  addExpense:    (row) => stmts.addExpense.run(row).lastInsertRowid,
  deleteExpense: (id) => stmts.deleteExpense.run(id),
  clearExpenses: () => stmts.clearExpenses.run(),

  getIncomes:    () => stmts.getIncomes.all(),
  addIncome:     (row) => stmts.addIncome.run(row).lastInsertRowid,
  deleteIncome:  (id) => stmts.deleteIncome.run(id),
  clearIncomes:  () => stmts.clearIncomes.run(),
};
