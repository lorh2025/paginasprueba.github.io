// assets/noticias.js
import { getDb, queryAll } from './db.js';

async function cargarNoticias() {
  const cont = document.getElementById('noticias');
  try {
    const db = await getDb();
    const sql = `
      SELECT Fecha, Noticia
      FROM Noticias
      ORDER BY date(Fecha) DESC
      LIMIT 3;
    `;
    const rows = queryAll(db, sql);
    cont.innerHTML = '';
    if (!rows.length) {
      cont.innerHTML = '<p class="muted">No hay noticias aún.</p>';
      return;
    }
    for (const r of rows) {
      const item = document.createElement('article');
      item.className = 'news-item';
      const fecha = new Date(r.Fecha).toLocaleDateString('es-GT');
      item.innerHTML = `<strong>${fecha}</strong><p>${r.Noticia}</p>`;
      cont.appendChild(item);
    }
  } catch (err) {
    cont.innerHTML = `<p class="error">Error al cargar noticias: ${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', cargarNoticias);
