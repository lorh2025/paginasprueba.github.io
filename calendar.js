import { getDb, queryAll } from './db.js';

const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function llenarSelectores() {
  const m = document.getElementById('mes');
  const a = document.getElementById('anio');
  meses.forEach((nombre, i) => m.add(new Option(nombre, String(i+1).padStart(2,'0'))));
  const y = new Date().getFullYear();
  for (let yr = y-2; yr <= y+2; yr++) a.add(new Option(String(yr), String(yr)));
  m.value = String(new Date().getMonth()+1).padStart(2,'0');
  a.value = String(y);
}

function daysInMonth(year, monthIdx0) { // monthIdx0: 0..11
  return new Date(year, monthIdx0 + 1, 0).getDate();
}

function crearCelda(dia) {
  const div = document.createElement('div');
  div.className = 'day';
  const h = document.createElement('h4');
  h.textContent = String(dia);
  div.appendChild(h);
  return div;
}

function abrirModal(titulo, cuerpo) {
  const modal = document.getElementById('modal');
  document.getElementById('modal-title').textContent = titulo;
  document.getElementById('modal-body').textContent = cuerpo;
  modal.showModal();
  document.getElementById('cerrar').onclick = () => modal.close();
}

async function renderCalendario() {
  const cont = document.getElementById('calendario');
  cont.innerHTML = '';
  const anio = document.getElementById('anio').value;
  const mes = document.getElementById('mes').value; // "01".."12"
  const primerDia = new Date(Number(anio), Number(mes)-1, 1).getDay(); // 0=Dom
  const total = daysInMonth(Number(anio), Number(mes)-1);

  // Encabezados de día (Dom..Sáb)
  const headers = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  headers.forEach(h => {
    const hd = document.createElement('div');
    hd.className = 'day';
    hd.innerHTML = `<h4>${h}</h4>`;
    cont.appendChild(hd);
  });

  // Relleno inicial
  for (let i=0;i<primerDia;i++) {
    const empty = document.createElement('div');
    empty.className = 'day';
    cont.appendChild(empty);
  }

  // Eventos del mes desde DB
  let eventos = [];
  try {
    const db = await getDb();
    const sql = `
      SELECT Fecha, Titulo, Descripcion
      FROM Calendario
      WHERE strftime('%Y', Fecha) = ? AND strftime('%m', Fecha) = ?
      ORDER BY date(Fecha) ASC;
    `;
    eventos = queryAll(db, sql, [anio, mes]);
  } catch (e) {
    console.error(e);
  }

  const mapa = new Map();
  for (const ev of eventos) {
    const d = new Date(ev.Fecha).getDate();
    if (!mapa.has(d)) mapa.set(d, []);
    mapa.get(d).push(ev);
  }

  for (let d=1; d<=total; d++) {
    const c = crearCelda(d);
    const lista = mapa.get(d) || [];
    if (lista.length) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = `${lista.length} evento(s)`;
      c.appendChild(badge);
      for (const ev of lista) {
        const a = document.createElement('a');
        a.className = 'event';
        a.textContent = ev.Titulo;
        a.href = '#';
        a.onclick = (e)=>{ e.preventDefault(); abrirModal(ev.Titulo, ev.Descripcion); };
        c.appendChild(a);
      }
    }
    cont.appendChild(c);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  llenarSelectores();
  document.getElementById('cargar').addEventListener('click', renderCalendario);
  renderCalendario();
});
