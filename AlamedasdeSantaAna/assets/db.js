// assets/db.js
// Utilidades para cargar la BD SQLite (sql.js) y ejecutar consultas de forma segura.

// Configuración sql.js: usa CDN para el WASM
export async function initSql() {
  return await initSqlJs({
    locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
  });
}

let _db = null; // instancia de SQL.Database

export async function getDb() {
  if (_db) return _db;
  const SQL = await initSql();
  const res = await fetch('./data/residencial.db', { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudo cargar la base de datos');
  const buf = await res.arrayBuffer();
  _db = new SQL.Database(new Uint8Array(buf));
  return _db;
}

export function queryAll(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

export function queryOne(db, sql, params = []) {
  const rows = queryAll(db, sql, params);
  return rows[0] || null;
}